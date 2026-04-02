// store/thunks/fetchAds.ts
import type { AppDispatch } from '../store';
import { adsService } from '../../services/ads.service';
import { setItems, setLoading, setError } from '../slices/ads.slice';
import type { GetAdsParams } from '../../shared/types/ad.types';

export const fetchAds = (params: GetAdsParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await adsService.getAds(params);
    dispatch(setItems({ items: data.items, total: data.total }));
    dispatch(setError(null));
  } catch (err: any) {
    dispatch(setError(err.message ?? 'Unknown error'));
  } finally {
    dispatch(setLoading(false));
  }
};