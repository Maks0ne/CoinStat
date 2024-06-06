import { FC, useState, useEffect } from "react";
import { useHttp } from "../../hooks/useHttps";
import { cryptoCurrencyApiResponse } from "../../config/Api";
import { ArrowLeftRight } from "lucide-react";
import Spinner from "../../components/spinner/Spinner";
import ErrorPage from "../../components/error/ErrorPage";

import './converter.scss'

interface ICoins {
  CoinInfo: {
    Name: string,
    FullName: string,
  },
  RAW: {
    USD: {
      PRICE: number,
    }
  }
}
interface ICoinsTransformed {
  name: string,
  fullName: string,
  price: number
}

const Converter: FC = () => {
  const { data, error, loading, fetchData } = useHttp<{ Data: ICoins[] }>(cryptoCurrencyApiResponse)
  const [coins, setCoins] = useState<ICoinsTransformed[]>([])
  const [firstSelector, setFirstSelector] = useState<number>(0)
  const [secondSelector, setSecondSelector] = useState<number>(0)
  const [inputValue, setInputValue] = useState<number>(0)
  const [result, setResult] = useState<number>(0)
  const [firstSelectorName, setFirstSelectorName] = useState<string>('')
  const [secondSelectorName, setSecondSelectorName] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      const transformData = data.Data.map((coin) => {
        const obj = {
          name: coin.CoinInfo.Name,
          fullName: coin.CoinInfo.FullName,
          price: +coin.RAW.USD.PRICE,
        }
        return obj
      })
      setCoins(transformData)

      if (transformData.length > 0) {     //setting selectors after the first load for correct display 
        setFirstSelector(transformData[0].price)
        setSecondSelector(transformData[0].price)
        setFirstSelectorName(transformData[0].name)
        setSecondSelectorName(transformData[0].name)
      }
    }
  }, [data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {  //getting data from input
    setInputValue(+e.target.value)
  }
  const handleFirstSelectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {  //getting data from selector
    setFirstSelector(+e.target.value)
    setFirstSelectorName(e.target.selectedOptions[0].text)

  }
  const handleSecondSelectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {   //getting data from selector
    setSecondSelector(+e.target.value)
    setSecondSelectorName(e.target.selectedOptions[0].text)
  }

  useEffect(() => {
    if (firstSelector && secondSelector && inputValue) {
      const convertedValue = Math.round(((inputValue * firstSelector) / secondSelector) * 100000) / 100000
      setResult(convertedValue)          //calculation and rounding of result
    }
  }, [inputValue, firstSelector, secondSelector])

  const swapSelectors = () => {
    const selectorValue = firstSelector
    const selectorNameValue = firstSelectorName
    setFirstSelector(secondSelector)            //func to replace values of selectors for a button
    setSecondSelector(selectorValue)
    setFirstSelectorName(secondSelectorName)
    setSecondSelectorName(selectorNameValue)
  }

  const isLoading = loading ? <Spinner /> : null
  const errorMessage = error ? <ErrorPage /> : null
  return (
    <div className="calculator">
      {errorMessage}
      {isLoading}

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

          <select className="coin-selector" value={secondSelector} onChange={handleSecondSelectorChange}>

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
