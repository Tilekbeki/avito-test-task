import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adsService } from '../../services/ads.service';

export const useAd = (id?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ad', id],
    queryFn: () => adsService.getAdById(id!),
    enabled: !!id, 
    staleTime: 0, 
  });

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