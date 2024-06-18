import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
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

export const fetchUserWallet = createAsyncThunk(
  'wallet/fetchUserWallet',
  async (userId: string) => {
    const coinsRef = collection(db, 'users', userId, 'wallet');
    const querySnapshot = await getDocs(coinsRef);
    const userWalletData: { coin: ICoinsTransformed; amount: number }[] = [];
    querySnapshot.forEach((doc) => {
      const coinData = doc.data() as ICoinsTransformed;
      const amount = doc.data().amount;
      userWalletData.push({ coin: coinData, amount });
    });
    return userWalletData;
  }
);

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
      await updateDoc(coinRef, {
        amount: coinDoc.data().amount + amount
      });
    } else {
      await setDoc(coinRef, { ...coin, amount });
    }
    return { coin, amount };
  }
);

export const removeCoinFromWallet = createAsyncThunk(
  'wallet/removeCoin',
  async ({ userId, coinName }: RemoveCoinPayload) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const coinRef = doc(db, 'users', userId, 'wallet', coinName);
    await deleteDoc(coinRef);
    return { coinName };
  }
);
