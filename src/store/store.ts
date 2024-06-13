import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
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

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;