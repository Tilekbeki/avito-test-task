import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GetAdsParams } from '../../shared/types/ad.types';

const getInitialParams = (): GetAdsParams & { viewMode: 'grid' | 'list' } => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    limit: urlParams.get('limit') ? Number(urlParams.get('limit')) : 10,
    skip: urlParams.get('skip') ? Number(urlParams.get('skip')) : 0,
    sortColumn: (urlParams.get('sortColumn') as GetAdsParams['sortColumn']) || 'createdAt',
    sortDirection: (urlParams.get('sortDirection') as GetAdsParams['sortDirection']) || 'desc',
    q: urlParams.get('q') || undefined,
    categories: urlParams.get('categories') ? urlParams.get('categories')!.split(',') : undefined,
    needsRevision: urlParams.has('needsRevision') ? urlParams.get('needsRevision') === 'true' : undefined,
    viewMode: (urlParams.get('viewMode') as 'grid' | 'list') || 'grid',
  };
};

interface FilterParamsState {  // ← переименовали интерфейс
  params: GetAdsParams & { viewMode: 'grid' | 'list' };
}

const initialState: FilterParamsState = {  // ← переименовали тип
  params: getInitialParams(),
};

const filterParamsSlice = createSlice({  // ← переименовали слайс
  name: 'filterParams',  // ← было 'ads'
  initialState,
  reducers: {
    setParams(state, action: PayloadAction<Partial<GetAdsParams & { viewMode: 'grid' | 'list' }>>) {
      state.params = { ...state.params, ...action.payload };
    },
    resetParams(state) {
      state.params = { 
        limit: 10, 
        skip: 0,
        sortColumn: 'createdAt',  
        sortDirection: 'desc',    
        q: undefined,            
        categories: undefined,    
        needsRevision: undefined,
        viewMode: 'grid',
      };
    },
  },
});

export const { setParams, resetParams } = filterParamsSlice.actions;  // ← экспортируем из нового слайса
export default filterParamsSlice.reducer;  // ← экспортируем новый reducer