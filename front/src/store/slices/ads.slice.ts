// store/slices/ads.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ItemWithRevision, GetAdsParams, Ad } from '../../shared/types/ad.types';
import type { RootState } from '../store';

interface AdsState {
  items: Ad[];
  params: GetAdsParams;
}

const initialState: AdsState = {
  items: [],
  total: 0,

  loading: false,
  error: null,

  params: {
    limit: 10,
    skip: 0,

    // ✅ ВОТ ЭТО ГЛАВНОЕ
    sortColumn: 'createdAt',
    sortDirection: 'desc',
  },
};

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setParams(state, action: PayloadAction<Partial<GetAdsParams>>) {
      state.params = { ...state.params, ...action.payload };
    },
    resetParams(state) {
      state.params = { limit: 10, skip: 0 };
    },
  },
});

export const {
  setParams,
  resetParams,
} = adsSlice.actions;

export default adsSlice.reducer;