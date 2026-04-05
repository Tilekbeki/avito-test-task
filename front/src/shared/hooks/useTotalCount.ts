import { useQuery } from '@tanstack/react-query';
import { adsService } from '../../services/ads.service';

export const useTotalCount = () => {
  return useQuery({
    queryKey: ['ads', 'total'],
    queryFn: async () => {
      const response = await adsService.getAds({ limit: 1, skip: 0 });
      return response.total;
    },
    staleTime: Infinity, 
    gcTime: 1000 * 60 * 5, 
  });
};