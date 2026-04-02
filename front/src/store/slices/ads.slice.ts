// store/slices/ads.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ItemWithRevision, GetAdsParams } from '../../shared/types/ad.types';
import type { RootState } from '../store';

interface AdsState {
  items: ItemWithRevision[];
  displayedItems: ItemWithRevision[];
  total: number;

  loading: boolean;
  error: string | null;

  params: GetAdsParams;
}

const initialState: AdsState = {
  items: [],
  displayedItems: [],
  total: 0,
  loading: false,
  error: null,
  params: { limit: 10, skip: 0 },
};

interface ApplyFiltersPayload {
  filterPanel: { selectedCategories: string[]; onlyNeedFix: boolean };
  searchFilter: { searchText: string; sortBy: string };
}

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<{ items: ItemWithRevision[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.displayedItems = action.payload.items;
    },

    setDisplayedItems(state, action: PayloadAction<ItemWithRevision[]>) {
      state.displayedItems = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setParams(state, action: PayloadAction<Partial<GetAdsParams>>) {
      state.params = { ...state.params, ...action.payload };
    },

    resetParams(state) {
      state.params = { limit: 10, skip: 0 };
    },

    /**
     * Универсальная фильтрация и сортировка
     */
    applyFiltersAndSort(state, action: PayloadAction<ApplyFiltersPayload>) {
      const { selectedCategories, onlyNeedFix } = action.payload.filterPanel;
      const { searchText, sortBy } = action.payload.searchFilter;

      // 1️⃣ фильтрация по категории, needsRevision и поиску
      const filtered = state.items.filter(ad => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(ad.category);
        const needsFixMatch = !onlyNeedFix || ad.needsRevision;
        const textMatch = ad.title.toLowerCase().includes(searchText.toLowerCase());
        return categoryMatch && needsFixMatch && textMatch;
      });

      // 2️⃣ сортировка
      switch (sortBy) {
        case 'name_asc':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name_desc':
          filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'date_asc':
          filtered.sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
          break;
        case 'date_desc':
          filtered.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
          break;
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
      }

      state.displayedItems = filtered;
    },
  },
});

export const {
  setItems,
  setDisplayedItems,
  setLoading,
  setError,
  setParams,
  resetParams,
  applyFiltersAndSort,
} = adsSlice.actions;

export default adsSlice.reducer;