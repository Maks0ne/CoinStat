import { FC, useState, useEffect } from 'react'
import { useHttp } from '../../../hooks/useHttps'
import { newsApiResponse } from '../../../config/Api'
import Spinner from '../../spinner/Spinner'
import ErrorPage from '../../error/ErrorPage'

import './news.scss'

interface INews {
  guid: string,
  imageurl: string,
  title: string,
  body: string,
}

const News: FC = () => {
  const { data, error, loading, fetchData } = useHttp<{ Data: INews[] }>(newsApiResponse)
  const [news, setNews] = useState<INews[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      const transformData = data.Data.map((item) => {
        const obj = {
          guid: item.guid,
          imageurl: item.imageurl,
          title: item.title,
          body: item.body
        }
        return obj
      })
      setNews(transformData)
    }
  }, [data]);

  const isLoading = loading ? <Spinner /> : null
  const errorMessage = error ? <ErrorPage /> : null
  return (
    <div className="news">
      {errorMessage}
      {isLoading}

      <div className="news-container">

        {news.map((item, index) => (
          <div className="news-item" key={index}>
            <a href={item.guid} target="_blank" rel="noopener noreferrer">
              <img src={item.imageurl} alt='news image' />
            </a>
            <div className='news-desq'>
              <h3>{item.title}</h3>
              <p>{item.body.length > 300 ? `${item.body.slice(0, 300)}...` : item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default News