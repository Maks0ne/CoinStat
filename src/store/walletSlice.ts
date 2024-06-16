import { createSlice } from '@reduxjs/toolkit';
import { addCoinToWallet, removeCoinFromWallet } from './walletThunks';
import { ICoinsTransformed } from '../api/cryptoCoinsApi';

interface IWallet {
  coin: ICoinsTransformed;
  amount: number;
}

interface IWalletState {
  walletResult: IWallet[];
}

const initialState: IWalletState = {
  walletResult: [],
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addCoinToWallet.fulfilled, (state, action) => {
      const existingCoin = state.walletResult.find(walletItem => walletItem.coin.name === action.payload.coin.name);
      if (existingCoin) {
        existingCoin.amount += action.payload.amount;
      } else {
        state.walletResult.push({ coin: action.payload.coin, amount: action.payload.amount });
      }
    });
    builder.addCase(removeCoinFromWallet.fulfilled, (state, action) => {
      state.walletResult = state.walletResult.filter(walletItem => walletItem.coin.name !== action.payload.coinName);
    });
  }
});

export default walletSlice.reducer; 