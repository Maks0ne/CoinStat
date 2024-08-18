import { FC, useState, useEffect } from "react";
import { useGetCoinsQuery, ICoinsTransformed } from "../../api/cryptoCoinsApi";
import { ArrowLeftRight } from "lucide-react";
import Spinner from "../../components/spinner/Spinner";
import ErrorPage from "../../components/error/ErrorPage";

import './converter.scss'

const Converter: FC = () => {
  const { data, error, isLoading } = useGetCoinsQuery();
  const [coins, setCoins] = useState<ICoinsTransformed[]>([])
  const [firstSelector, setFirstSelector] = useState<number>(0)
  const [secondSelector, setSecondSelector] = useState<number>(0)
  const [inputValue, setInputValue] = useState<number>(0)
  const [result, setResult] = useState<number>(0)
  const [firstSelectorName, setFirstSelectorName] = useState<string>('')
  const [secondSelectorName, setSecondSelectorName] = useState<string>('')

  useEffect(() => {
    if (data) {
      setCoins(data);

      if (data.length > 0) {
        const initialCoin = data[0];
        setFirstSelector(initialCoin.price);
        setSecondSelector(initialCoin.price);
        setFirstSelectorName(initialCoin.name);
        setSecondSelectorName(initialCoin.name);
      }
    }
  }, [data]);

  //getting data from input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(+e.target.value)
  }

  //getting data from selector
  const handleFirstSelectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstSelector(+e.target.value)
    setFirstSelectorName(e.target.selectedOptions[0].text)

  }

  //getting data from selector
  const handleSecondSelectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecondSelector(+e.target.value)
    setSecondSelectorName(e.target.selectedOptions[0].text)
  }

  //calculation and rounding of result
  useEffect(() => {
    if (firstSelector && secondSelector && inputValue) {
      const convertedValue = Math.round(((inputValue * firstSelector) / secondSelector) * 100000) / 100000
      setResult(convertedValue)
    }
  }, [inputValue, firstSelector, secondSelector])

  //func to replace values of selectors for a button
  const swapSelectors = () => {
    setFirstSelector(secondSelector);
    setSecondSelector(firstSelector);
    setFirstSelectorName(secondSelectorName);
    setSecondSelectorName(firstSelectorName);
  }

  return (
    <div className="calculator">
      {error && <ErrorPage />}
      {isLoading && <Spinner />}

      <div className="converter-container">
        <h2>Cryptocurrency Converter</h2>
        <input className="amount-input"
          type="number"
          placeholder="Enter amount to convert"
          onChange={handleInputChange} />

        <div className="selector-container">
          <select className="coin-selector" value={firstSelector} onChange={handleFirstSelectorChange}>
            {coins.map((coin) => (
              <option key={coin.name} value={coin.price}>{coin.name} </option>
            ))}
          </select>

          <button className="toggleBtn" onClick={swapSelectors}><ArrowLeftRight /></button>

          <select className="coin-selector" value={secondSelector} onChange={handleSecondSelectorChange} aria-label="Coin selector">

            {coins.map((coin) => (
              <option key={coin.name} value={coin.price}>{coin.name}</option>
            ))}
          </select>
        </div>
        <p className="result">{result > 0 ? `${firstSelectorName} = ${result} ${secondSelectorName}` : result}</p>
      </div>
    </div>
  )
};

export default Converter
