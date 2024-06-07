import { FC, useEffect, useState } from "react";
import { useGetCoinsQuery, ICoinsTransformed } from '../../api/useCryptoApi'
import Spinner from "../spinner/Spinner";
import ErrorPage from "../error/ErrorPage";
import './coinsDataTable.scss';

const CoinsDataTable: FC = () => {
  const { data, error, isLoading, refetch } = useGetCoinsQuery();
  const [cryptoData, setCryptoData] = useState<ICoinsTransformed[]>([]);

  useEffect(() => {
    if (data) {
      setCryptoData(data);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(refetch, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorPage />;

  return (
    <div className="coins-data-content">
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

export default CoinsDataTable;
