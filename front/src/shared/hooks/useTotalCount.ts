// shared/hooks/useTotalCount.ts
import { useQuery } from '@tanstack/react-query';
import { adsService } from '../../services/ads.service';

export const useTotalCount = () => {
  return useQuery({
    queryKey: ['ads', 'total'],
    queryFn: async () => {
      // Запрашиваем без лимита и пагинации
      const response = await adsService.getAds({ limit: 1, skip: 0 });
      return response.total;
    },
    staleTime: Infinity, // Никогда не устаревает
    gcTime: 1000 * 60 * 5, // Храним в кэше 5 минут
  });
};