// shared/hooks/useAd.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adsService } from '../../services/ads.service';
import type { ItemWithRevision } from '../types/ad.types';

export const useAd = (id?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ad', id],
    queryFn: () => adsService.getAdById(id!),
    enabled: !!id, // Запрос выполняется только если есть id
    staleTime: 0, // Меняем на 0, чтобы данные всегда обновлялись
  });

  // Функция для принудительного обновления
  const refetchAd = () => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['ad', id] });
    }
  };

  return {
    ...query,
    refetchAd,
  };
};