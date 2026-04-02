import { configureStore } from '@reduxjs/toolkit';
import adsReducer from './slices/ads.slice';
import filterPanelReducer from './slices/filterPanel.slice';
import searchFilterReducer from './slices/searchFilter.slice';

export const store = configureStore({
  reducer: {
    ads: adsReducer,
    filterPanel: filterPanelReducer,
    searchFilter: searchFilterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
