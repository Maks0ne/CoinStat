import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { addCoinToWallet, removeCoinFromWallet, fetchUserWallet } from "../../../store/walletThunks";
import { useGetCoinsQuery, ICoinsTransformed } from '../../../api/cryptoCoinsApi'
import { auth } from '../../../config/firebaseConfig'
import { onAuthStateChanged } from "firebase/auth";
import { MoveUp } from 'lucide-react';
import { MoveDown } from 'lucide-react';
import PieChart from "./pieChart/PieChart";
import Spinner from "../../spinner/Spinner";
import ErrorPage from "../../error/ErrorPage";

import './wallet.scss'

interface ISelectedCoin extends ICoinsTransformed {
  amount?: number;
}

const Wallet: FC = () => {
  const { data, error, isLoading, refetch } = useGetCoinsQuery();
  const dispatch = useDispatch<AppDispatch>();
  const walletResult = useSelector((state: RootState) => state.wallet.walletResult);
  const [totalWalletAmount, setTotalWalletAmount] = useState<number>(0)
  const [coins, setCoins] = useState<ICoinsTransformed[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<ISelectedCoin | null>(null);
  const [inputValue, setInputValue] = useState<number>(0)
  const [purchaseResult, setPurchaseResult] = useState<number>(0);
  const [validation, setValidation] = useState<boolean>(false)
  const [isSuccsessModalOpen, setIsSuccsessModalOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [selectedSellCoin, setSelectedSellCoin] = useState<ISelectedCoin | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false)

  // Get current user and load their wallet
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        dispatch(fetchUserWallet(user.uid));
        setIsAuth(true)
      } else {
        setUserId(null);
        setIsAuth(false)
        setCoins([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Update coin list when new data is received
  useEffect(() => {
    if (data) {
      setCoins(data);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(refetch, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  //Calculating Total Portfolio Value
  useEffect(() => {
    if (!walletResult || !coins) {
      setTotalWalletAmount(0);
      return;
    }
    const total = walletResult.reduce((sum, walletItem) => {
      const coin = coins.find(c => c.name === walletItem.coin.name);
      if (coin) {
        return sum + coin.price * walletItem.amount;
      }
      return sum;
    }, 0);

    setTotalWalletAmount(total);
  }, [walletResult, coins]);

  // Handle coin selection change
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const selected = coins.find(coin => coin.name === selectedName) || null;
    setSelectedCoin(selected);
  };

  // Handle input value change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(+e.target.value);
  };

  // Close all modals and reset relevant states
  const closeModal = () => {
    setIsModalOpen(false)
    setIsSuccsessModalOpen(false)
    setIsSellModalOpen(false)
    setInputValue(0)
    setPurchaseResult(0)
  };

  // Execute purchase action and update state accordingly
  const resultPurchase = () => {
    if (selectedCoin && userId) {
      dispatch(addCoinToWallet({ userId, coin: selectedCoin, amount: inputValue }));
      setPurchaseResult(inputValue)
      setIsModalOpen(false);
      setIsSuccsessModalOpen(true);
    }
  };

  // Handle coin selling action
  const handleSell = (coinName: string, amount: number) => {
    if (userId) {
      dispatch(removeCoinFromWallet({ userId, coinName }));
      openSellModal(coinName, amount);
    }
  };

  // Open modal to confirm selling action
  const openSellModal = (coinName: string, amount: number) => {
    const coin = walletResult.find(item => item.coin.name === coinName)?.coin;
    if (coin) {
      setSelectedSellCoin({ ...coin, amount });
      setIsSellModalOpen(true);
    }
  };

  return (
    <div className="wallet-content" >
      {error && <ErrorPage />}
      {isLoading && <Spinner />}

      {!isAuth ?
        <div className="auth-section" >
          <p>Login please</p>
        </div> :

        <>
          {/* Div for BG blur and closing the modal from the outside */}
          <div className={(isModalOpen || isSuccsessModalOpen || isSellModalOpen) ? 'modal-overlay' : ''} onClick={() => (isModalOpen || isSuccsessModalOpen || isSellModalOpen) && closeModal()} >
            <div className="wallet-container">
              <div>

                {/* Coin Select*/}
                <select className="coin-select" aria-label="Coin selector" onChange={handleSelectChange}>
                  <option>Open / Close</option>

                  {coins.map((coin) => (
                    <option
                      key={coin.name}
                      label={coin.name}
                      value={coin.name}>
                    </option>
                  ))}
                </select>

                {/* Selected Coin */}
                {selectedCoin && (
                  <div className="selected-coin">
                    <img src={selectedCoin?.imageUrl} alt={selectedCoin?.fullName} />
                    <div className="coin-desq">
                      <h3>{selectedCoin?.name}</h3>
                      <p>{selectedCoin?.fullName}</p>
                      <p>{selectedCoin?.price.toFixed(5)} $</p>
                      <span
                        className={selectedCoin.change24hour > 0 ? 'green' : 'red'} >
                        {selectedCoin.change24hour > 0 ? <MoveUp color="rgba(74, 255, 0, 0.42)" /> : <MoveDown color="rgba(255, 0, 0, 0.659)" />}
                        {selectedCoin.change24hour.toFixed(5)} $
                      </span>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="wallet-button">Buy it!</button>
                  </div>
                )}
              </div>

              {/* Purchase list */}
              <div className="wallet-list">
                <h3>Your wallet</h3>
                <p className="wallet-amount">{totalWalletAmount > 0 ? ` Total amount of your wallet: ${totalWalletAmount.toFixed(2) }USD` : null}</p>
                {walletResult.map(item => (
                  <div className="wallet-list-item" key={item.coin.name}>
                    <img src={item.coin.imageUrl} alt={item.coin.fullName} />
                    <p>{item.coin.fullName}</p>
                    <p>{item.amount}</p>
                    <button className="wallet-button" onClick={() => handleSell(item.coin.name, item.amount)}>Sell</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart  */}
            <PieChart />
          </div>

          {/*    Modal    */}
          {(isModalOpen && selectedCoin) && (
            <div className='modal'>

              <img src={selectedCoin?.imageUrl} alt={selectedCoin?.fullName} />
              <p>{selectedCoin?.fullName}</p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number"
                  placeholder="Enter amount"
                  onChange={handleInputChange} />
                <p>price: {selectedCoin.price.toFixed(5)} $</p>
              </div>

              <p>Total: {(selectedCoin?.price * inputValue).toFixed(4)} $</p>
              {validation && <p style={{ color: 'red' }}>Enter amount</p>}

              <button className='wallet-button' onClick={inputValue > 0 ? resultPurchase : () => setValidation(true)}>
                Buy !
              </button>
              <p className='close-btn' onClick={closeModal}></p>
            </div>)}

          {/* Succsess modal */}
          {(isSuccsessModalOpen && selectedCoin) && (
            <div className='succsess-modal'>

              <h2>You have successfully bought {purchaseResult} {selectedCoin.name}</h2>
              <p className='close-btn' onClick={closeModal}></p>

            </div>
          )}

          {/* Sales Modal */}
          {(isSellModalOpen && selectedSellCoin) && (
            <div className='succsess-modal'>

              <h2>You sold {selectedSellCoin.amount} {selectedSellCoin?.name}</h2>
              <p className='close-btn' onClick={closeModal}></p>

            </div>
          )}
        </>}
    </div>
  )
};

export default Wallet