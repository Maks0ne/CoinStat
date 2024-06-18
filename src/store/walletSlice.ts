import { createSlice } from '@reduxjs/toolkit';
import { addCoinToWallet, removeCoinFromWallet, fetchUserWallet } from './walletThunks';
import { ICoinsTransformed } from '../api/cryptoCoinsApi';

interface IWalletItem {
  coin: ICoinsTransformed;
  amount: number;
}

interface IWalletState {
  walletResult: IWalletItem[];
}

const initialState: IWalletState = {
  walletResult: [],
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWallet.fulfilled, (state, action) => {
        state.walletResult = action.payload;
      })
      .addCase(addCoinToWallet.fulfilled, (state, action) => {
        const { coin, amount } = action.payload;
        const existingCoin = state.walletResult.find(walletItem => walletItem.coin.name === coin.name);
        if (existingCoin) {
          existingCoin.amount += amount;
        } else {
          state.walletResult.push({ coin, amount });
        }
      })
      .addCase(removeCoinFromWallet.fulfilled, (state, action) => {
        const { coinName } = action.payload;
        state.walletResult = state.walletResult.filter(walletItem => walletItem.coin.name !== coinName);
      });
  },
});

export default walletSlice.reducer;
