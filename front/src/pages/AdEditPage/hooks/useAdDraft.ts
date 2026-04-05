import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { adsService } from '../../../services/ads.service';
import type { ItemUpdateIn} from '../../../shared/types/ad.types';
import { defaultParams } from '../constants';

interface UseAdDraftResult {
  loading: boolean;
  error: string | null;
  formData: ItemUpdateIn | null;
  setFormData: React.Dispatch<React.SetStateAction<ItemUpdateIn | null>>;
  saveDraft: () => void;
  clearDraft: () => void;
}

export const useAdDraft = (id: string | undefined): UseAdDraftResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ItemUpdateIn | null>(null);

  // Загрузка черновика из localStorage и с сервера
  useEffect(() => {
    if (!id) return;

    const loadDraft = async () => {
      try {
        setLoading(true);
        const data = await adsService.getAdById(id);

        // Сохраняем существующий тип из данных
        const mergedParams = { ...defaultParams[data.category], ...data.params };

        // Если тип есть в данных, используем его
        if (data.params?.type) {
          mergedParams.type = data.params.type;
        }

        // Проверяем наличие черновика
        const draftKey = `ad_draft_${id}`;
        const savedDraft = localStorage.getItem(draftKey);

        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          const shouldRestore = window.confirm('Найден несохраненный черновик. Восстановить?');
          if (shouldRestore) {
            setFormData(draft);
            message.info('Черновик восстановлен');
          } else {
            setFormData({
              category: data.category,
              title: data.title,
              description: data.description || '',
              price: data.price,
              params: mergedParams,
            });
            localStorage.removeItem(draftKey);
          }
        } else {
          setFormData({
            category: data.category,
            title: data.title,
            description: data.description || '',
            price: data.price,
            params: mergedParams,
          });
        }
      } catch (e: any) {
        setError(e.message || 'Ошибка при загрузке объявления');
      } finally {
        setLoading(false);
      }
    };

    loadDraft();
  }, [id]);

  // Сохраняем черновик в localStorage при изменениях
  const saveDraft = useCallback(() => {
    if (formData && id) {
      const draftKey = `ad_draft_${id}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, id]);

  useEffect(() => {
    saveDraft();
  }, [formData, saveDraft]);

  // Очистка черновика
  const clearDraft = useCallback(() => {
    if (id) {
      localStorage.removeItem(`ad_draft_${id}`);
    }
  }, [id]);

  return { loading, error, formData, setFormData, saveDraft, clearDraft };
};
