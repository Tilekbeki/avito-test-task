// store/slices/filterPanel.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../shared/types/ad.types';

interface FilterPanelState {
  selectedCategories: Category[];
  onlyNeedFix: boolean;
}

const initialState: FilterPanelState = {
  selectedCategories: [],
  onlyNeedFix: false,
};

const filterPanelSlice = createSlice({
  name: 'filterPanel',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.selectedCategories = action.payload;
    },
    setOnlyNeedFix(state, action: PayloadAction<boolean>) {
      state.onlyNeedFix = action.payload;
    },
    resetFilters(state) {
      state.selectedCategories = [];
      state.onlyNeedFix = false;
    },
  },
});

export const { setCategories, setOnlyNeedFix, resetFilters } = filterPanelSlice.actions;
export default filterPanelSlice.reducer;