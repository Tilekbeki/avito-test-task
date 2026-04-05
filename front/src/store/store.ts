import { configureStore } from '@reduxjs/toolkit';
import filterParamsReducer from './slices/filterParams.slice'; 

export const store = configureStore({
  reducer: {
    filterParams: filterParamsReducer, // ← было ads: adsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;