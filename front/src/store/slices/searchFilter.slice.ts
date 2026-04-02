// store/slices/searchFilter.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ItemWithRevision } from '../../shared/types/ad.types';
import type { RootState } from '../store';

interface SearchFilterState {
  searchText: string;
  viewMode: 'grid' | 'list';
  sortBy: 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
  displayedItems: ItemWithRevision[];
}

const initialState: SearchFilterState = {
  searchText: '',
  viewMode: 'grid',
  sortBy: 'name_asc',
};

const searchFilterSlice = createSlice({
  name: 'searchFilter',
  initialState,
  reducers: {
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },
    setViewMode(state, action: PayloadAction<'grid' | 'list'>) {
      state.viewMode = action.payload;
    },
    setSortBy(state, action: PayloadAction<SearchFilterState['sortBy']>) {
      state.sortBy = action.payload;
    },
  },
});

export const { setSearchText, setViewMode, setSortBy } =
  searchFilterSlice.actions;

export default searchFilterSlice.reducer;