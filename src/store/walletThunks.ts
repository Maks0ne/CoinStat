import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { ICoinsTransformed } from "../api/cryptoCoinsApi";

interface AddCoinPayload {
  userId: string;
  coin: ICoinsTransformed;
  amount: number;
}

interface RemoveCoinPayload {
  userId: string;
  coinName: string;
}

export const addCoinToWallet = createAsyncThunk(
  'wallet/addCoin',
  async ({ userId, coin, amount }: AddCoinPayload) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const coinName = coin.name;
    const coinRef = doc(db, 'users', userId, 'wallet', coinName);
    const coinDoc = await getDoc(coinRef);

    if (coinDoc.exists()) {
      // Если документ существует, обновляем его
      await updateDoc(coinRef, {
        amount: coinDoc.data().amount + amount
      });
    } else {
      // Если документ не существует, создаем новый
      await setDoc(coinRef, { ...coin, amount });
    }

    return { coin, amount };
  }
);

interface RemoveCoinPayload {
  coinName: string;
}

export const removeCoinFromWallet = createAsyncThunk(
  'wallet/removeCoin',
  async ({ coinName }: RemoveCoinPayload) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const userId = user.uid;
    const coinRef = doc(db, 'users', userId, 'wallet', coinName);
    await deleteDoc(coinRef);
    return { coinName };
  }
);