import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { adsService } from '../../services/ads.service';
import type { ItemUpdateIn } from '../types/ad.types';
import { defaultParams } from '../data/constants';

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

  useEffect(() => {
    if (!id) return;

    isMountedRef.current = true;
    hasShownDialogRef.current = false;

    const loadDraft = async () => {
      try {
        setLoading(true);
        
        const data = await adsService.getAdById(id);

        if (!isMountedRef.current) return;

        const mergedParams = { ...defaultParams[data.category], ...data.params } as any;
        
        if ((data.params as any)?.type) {
          mergedParams.type = (data.params as any).type;
        }

        const serverData: ItemUpdateIn = {
          category: data.category,
          title: data.title,
          description: data.description || '',
          price: data.price,
          params: mergedParams,
        };

        originalDataRef.current = serverData;

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

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  
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