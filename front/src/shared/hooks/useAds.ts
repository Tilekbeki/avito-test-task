import { useQuery } from '@tanstack/react-query';
import { adsService } from '../../services/ads.service';
import type { GetAdsParams } from '../../services/ads.service';

export const useAds = (params: GetAdsParams) => {
  return useQuery({
    queryKey: ['ads', params],
    queryFn: ({ signal }) => adsService.getAds(params, signal),
    keepPreviousData: true, // 🔥 чтобы не мигало при пагинации
  });
};