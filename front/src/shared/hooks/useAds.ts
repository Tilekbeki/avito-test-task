import { useQuery } from '@tanstack/react-query';
import { adsService } from '../../services/ads.service';
import { useDispatch } from 'react-redux';
import { store } from '../../store/store';
import {
  setItems,
  setError,
  applyFilters,
} from '../../store/slices/ads.slice';
import type { GetAdsParams } from '../types/ad.types';

type AppDispatch = typeof store.dispatch;

export const useAds = (params: GetAdsParams) => {
  const dispatch = useDispatch<AppDispatch>();

  return useQuery({
    queryKey: ['ads', params],
    queryFn: ({ signal }) => adsService.getAds(params, signal),

    onSuccess: (data) => {
      dispatch(setItems(data));
      dispatch(applyFilters());
      dispatch(setError(null));
    },

    onError: (error: any) => {
      dispatch(setError(error.message ?? 'Unknown error'));
    },

    keepPreviousData: true,
  });
};