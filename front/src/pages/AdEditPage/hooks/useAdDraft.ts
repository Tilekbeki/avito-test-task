// hooks/useAdDraft.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { adsService } from '../../../services/ads.service';
import type { ItemUpdateIn } from '../../../shared/types/ad.types';
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
  const originalDataRef = useRef<ItemUpdateIn | null>(null); // Храним оригинальные данные
  const isFirstLoadRef = useRef(true); // Флаг первой загрузки

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

        const serverData: ItemUpdateIn = {
          category: data.category,
          title: data.title,
          description: data.description || '',
          price: data.price,
          params: mergedParams,
        };

        // Сохраняем оригинальные данные с сервера
        originalDataRef.current = serverData;

        // Проверяем наличие черновика
        const draftKey = `ad_draft_${id}`;
        const savedDraft = localStorage.getItem(draftKey);

        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          
          // Проверяем, отличается ли черновик от серверных данных
          const isDraftDifferent = JSON.stringify(draft) !== JSON.stringify(serverData);
          
          if (isDraftDifferent) {
            const shouldRestore = window.confirm('Найден несохраненный черновик. Восстановить?');
            if (shouldRestore) {
              setFormData(draft);
              message.info('Черновик восстановлен');
            } else {
              setFormData(serverData);
              localStorage.removeItem(draftKey);
            }
          } else {
            // Черновик совпадает с серверными данными - удаляем его
            setFormData(serverData);
            localStorage.removeItem(draftKey);
          }
        } else {
          setFormData(serverData);
        }
      } catch (e: any) {
        setError(e.message || 'Ошибка при загрузке объявления');
      } finally {
        setLoading(false);
        isFirstLoadRef.current = false;
      }
    };

    loadDraft();
  }, [id]);

  // Сохраняем черновик в localStorage только если данные изменились
  const saveDraft = useCallback(() => {
    // Не сохраняем во время первой загрузки
    if (isFirstLoadRef.current) return;
    
    if (formData && id && originalDataRef.current) {
      // Проверяем, изменились ли данные
      const isChanged = JSON.stringify(formData) !== JSON.stringify(originalDataRef.current);
      
      if (isChanged) {
        const draftKey = `ad_draft_${id}`;
        localStorage.setItem(draftKey, JSON.stringify(formData));
        console.log('Черновик сохранен');
      } else {
        // Если данные вернулись к оригинальным - удаляем черновик
        const draftKey = `ad_draft_${id}`;
        if (localStorage.getItem(draftKey)) {
          localStorage.removeItem(draftKey);
          console.log('Черновик удален (данные совпадают с оригиналом)');
        }
      }
    }
  }, [formData, id]);

  useEffect(() => {
    saveDraft();
  }, [formData, saveDraft]);

  // Очистка черновика
  const clearDraft = useCallback(() => {
    if (id) {
      localStorage.removeItem(`ad_draft_${id}`);
      console.log('Черновик очищен');
    }
  }, [id]);

  return { loading, error, formData, setFormData, saveDraft, clearDraft };
};