import { configureStore } from '@reduxjs/toolkit';
import { cryptoCoinApi } from '../api/cryptoCoinsApi';
import walletReducer from './walletSlice'

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    [cryptoCoinApi.reducerPath]: cryptoCoinApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cryptoCoinApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (dispatch: AppDispatch, getState: () => RootState) => ReturnType;
