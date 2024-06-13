import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICoinsTransformed } from '../api/cryptoCoinsApi'

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
  reducers: {
  addCoinToWallet: (state, action: PayloadAction<{ coin: ICoinsTransformed; amount: number }>) => {
    const existingCoin = state.walletResult.find(walletItem => walletItem.coin.name === action.payload.coin.name);
    if (existingCoin) {
      existingCoin.amount += action.payload.amount;
    } else {
      state.walletResult.push({ coin: action.payload.coin, amount: action.payload.amount });
    }
  },
  removeCoinFromWallet: (state, action: PayloadAction<{ coinName: string }>) => {
    state.walletResult = state.walletResult.filter(walletItem => walletItem.coin.name !== action.payload.coinName);
  },
},
});

export const { addCoinToWallet, removeCoinFromWallet } = walletSlice.actions;
export default walletSlice.reducer;