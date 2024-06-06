import { FC, useEffect, useState } from "react";
import PieChart from "./pieChart/PieChart";
import { useHttp } from "../../../hooks/useHttps";
import { cryptoCurrencyApiResponse } from "../../../config/Api";
import { MoveUp } from 'lucide-react';
import { MoveDown } from 'lucide-react';
import Spinner from "../../spinner/Spinner";
import ErrorPage from "../../error/ErrorPage";

import './wallet.scss'

interface ICoins {  // Define the interface for the coin data fetched from the API
  CoinInfo: {
    Name: string,
    FullName: string,
    ImageUrl: string,
  },
  RAW: {
    USD: {
      PRICE: number,
      CHANGE24HOUR: number,
    }
  }
}

export interface ICoinsTransformed {    // Define the transformed coin data interface
  name: string;
  fullName: string;
  imageUrl: string;
  price: number;
  change24hour: number;
  amount?: number
}

interface IWallet {
  coin: ICoinsTransformed;
  amount: number;
}

const Wallet: FC = () => {
  const { fetchData, data, loading, error } = useHttp<{ Data: ICoins[] }>(cryptoCurrencyApiResponse);
  const [coins, setCoins] = useState<ICoinsTransformed[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<ICoinsTransformed | null>(null);
  const [inputValue, setInputValue] = useState<number>(0)
  const [purchaseResult, setPurchaseResult] = useState<number>(0);
  const [walletResult, setWalletResult] = useState<IWallet[]>([])
  const [validation, setValidation] = useState<boolean>(false)
  const [isSuccsessModalOpen, setIsSuccsessModalOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [selectedSellCoin, setSelectedSellCoin] = useState<ICoinsTransformed | null>(null);

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {    // Transform fetched data when it changes
    if (data) {
      const transformData = data.Data.map((coin) => {
        const obj = {
          name: coin.CoinInfo.Name,
          fullName: coin.CoinInfo.FullName,
          imageUrl: `https://www.cryptocompare.com/media${coin.CoinInfo.ImageUrl}`,
          price: +coin.RAW.USD.PRICE,
          change24hour: coin.RAW.USD.CHANGE24HOUR,
        }
        return obj
      })
      setCoins(transformData)
    }
  }, [data]);

  // Handle coin selection change
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const selected = coins.find(coin => coin.name === selectedName) || null;
    setSelectedCoin(selected);
  };

  // Handle input value change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(+e.target.value);
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsSuccsessModalOpen(false)
    setIsSellModalOpen(false)
    setInputValue(0)
    setPurchaseResult(0)
  }

  const resultPurchase = () => {
    if (selectedCoin) {
      setPurchaseResult(inputValue);


      setWalletResult(prev => {
        const existingCoinIndex = prev.findIndex(walletItem => walletItem.coin.name === selectedCoin.name);
        if (existingCoinIndex !== -1) {
          // Update the amount if the coin already exists in the wallet
          return prev.map((walletItem, index) => {
            if (index === existingCoinIndex) {
              return { ...walletItem, amount: walletItem.amount + inputValue };
            }
            return walletItem;
          });
        } else {
          // Add the new coin to the wallet
          return [...prev, { coin: selectedCoin, amount: inputValue }];
        }
      });

      setValidation(false)
      setIsModalOpen(false)
      setIsSuccsessModalOpen(true)
    }
  }

  // Handle selling of a cryptocurrency by updating the wallet and opening the modal with sale details
  const handleSell = (coinName: string, amount: number) => {
    setWalletResult(prev => {
      const updatedWallet = prev.filter(walletItem => walletItem.coin.name !== coinName);
      openSellModal(coinName, amount);
      return updatedWallet;
    });
  };

  const openSellModal = (coinName: string, amount: number) => {
    const coin = walletResult.find(item => item.coin.name === coinName)?.coin;
    if (coin) {
      setSelectedSellCoin({ ...coin, amount });
      setIsSellModalOpen(true);
    }
  }

  const isLoading = loading ? <Spinner /> : null
  const errorMessage = error ? <ErrorPage /> : null
  return (
    <div className="wallet-content" >
      {errorMessage}
      {isLoading}

      {/* Div for BG blur and closing the modal from the outside */}
      <div className={(isModalOpen || isSuccsessModalOpen || isSellModalOpen) ? 'modal-overlay' : ''} onClick={() => (isModalOpen || isSuccsessModalOpen || isSellModalOpen) && closeModal()} >
        <div className="wallet-container">
          <div>

            {/* Coin Select*/}
            <select className="coin-select" onChange={handleSelectChange}>
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
        <PieChart wallet={walletResult} />
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
    </div>
  )
}

export default Wallet