import { useState, useEffect, FC } from "react"
import { cryptoCurrencyApiResponse } from "../../config/Api";
import { useHttp } from "../../hooks/useHttps"
import Spinner from "../spinner/Spinner";
import ErrorPage from "../error/ErrorPage";

import './coinsDataTable.scss'

interface ICoins {
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

interface ICoinsTransformed {
  name: string;
  fullName: string;
  imageUrl: string;
  price: number;
  change24hour: number
}
const CoinsDataTable: FC = () => {
  const { fetchData, data, loading, error } = useHttp<{ Data: ICoins[] }>(cryptoCurrencyApiResponse);
  const [cryptoData, setCryptoData] = useState<ICoinsTransformed[]>([]);
  
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
      setCryptoData(transformData)
    }
  }, [data]);
  const isLoading = loading ? <Spinner /> : null
  const errorMessage = error ? <ErrorPage /> : null
  return (
    <div className="coins-data-content">
      {errorMessage}
      {isLoading}

      <h3>Toplist by 24H Volume</h3>
      {cryptoData.slice(0, 15).map((coin) => (
        <div className='coin-data' key={coin.name}>
          <img src={coin.imageUrl} alt={coin.fullName} />
          <p>{coin.name}</p>
          <p>{coin.fullName}</p>
          <p className={`price ${coin.change24hour < 0 ? 'red' : 'green'}`} title={`${coin.price}`}>$ {coin.price.toFixed(2)}</p>
          <p>{coin.change24hour.toFixed(3)} $</p>
        </div>
      ))}
    </div>
  );
}

export default CoinsDataTable