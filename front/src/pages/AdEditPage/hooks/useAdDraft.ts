// pages/AdEditPage/hooks/useAdDraft.ts
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
  const originalDataRef = useRef<ItemUpdateIn | null>(null);
  const isMountedRef = useRef(true);
  const hasShownDialogRef = useRef(false);

  // Загрузка черновика из localStorage и с сервера
  useEffect(() => {
    if (!id) return;

    isMountedRef.current = true;
    hasShownDialogRef.current = false;

    const loadDraft = async () => {
      try {
        setLoading(true);
        
        // Загружаем данные с сервера
        const data = await adsService.getAdById(id);

        if (!isMountedRef.current) return;

        // Формируем данные с сервера
        const mergedParams = { ...defaultParams[data.category], ...data.params };
        
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

        // Сохраняем оригинальные данные
        originalDataRef.current = serverData;

        // Проверяем черновик
        const draftKey = `ad_draft_${id}`;
        const savedDraft = localStorage.getItem(draftKey);

        if (savedDraft && !hasShownDialogRef.current) {
          const draft = JSON.parse(savedDraft);
          const isDraftDifferent = JSON.stringify(draft) !== JSON.stringify(serverData);
          
          if (isDraftDifferent) {
            hasShownDialogRef.current = true;
            const shouldRestore = window.confirm('Найден несохраненный черновик. Восстановить?');
            
            if (shouldRestore) {
              setFormData(draft);
              message.info('Черновик восстановлен');
            } else {
              setFormData(serverData);
              localStorage.removeItem(draftKey);
            }
          } else {
            setFormData(serverData);
            localStorage.removeItem(draftKey);
          }
        } else {
          setFormData(serverData);
        }
      } catch (e: any) {
        if (isMountedRef.current) {
          setError(e.message || 'Ошибка при загрузке объявления');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadDraft();

    return () => {
      isMountedRef.current = false;
    };
  }, [id]);

  // Сохранение черновика
  const saveDraft = useCallback(() => {
    if (!formData || !id || !originalDataRef.current) return;
    
    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalDataRef.current);
    const draftKey = `ad_draft_${id}`;
    
    if (isChanged) {
      localStorage.setItem(draftKey, JSON.stringify(formData));
      console.log('💾 Черновик сохранен');
    } else {
      if (localStorage.getItem(draftKey)) {
        localStorage.removeItem(draftKey);
        console.log('🗑️ Черновик удален');
      }
    }
  }, [formData, id]);

  // Авто-сохранение с debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, saveDraft]);

  // Очистка черновика
  const clearDraft = useCallback(() => {
    if (id) {
      const draftKey = `ad_draft_${id}`;
      localStorage.removeItem(draftKey);
      console.log('🧹 Черновик очищен');
    }
  }, [id]);

  return { 
    loading, 
    error, 
    formData, 
    setFormData, 
    saveDraft, 
    clearDraft 
  };
};