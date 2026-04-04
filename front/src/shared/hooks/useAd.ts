// shared/hooks/useAd.ts
import { useQuery } from '@tanstack/react-query';
import { adsService } from '../../services/ads.service';
import type { ItemWithRevision } from '../types/ad.types';

export const useAd = (id?: string) => {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => adsService.getAdById(id!),
    enabled: !!id, // Запрос выполняется только если есть id
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};