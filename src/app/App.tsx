import { FC, lazy, Suspense } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Spinner from '../components/spinner/Spinner'
import Page404 from '../components/pages/page404/Page404'
import { Provider } from 'react-redux';
import { store } from '../store/store.ts'

const MainPage = lazy(() => import('../components/pages/mainPage/MainPage.tsx'))
const CryptoConverter = lazy(() => import('../components/pages/cryptoConverter/CryptoConverter.tsx'))
const News = lazy(() => import('../components/pages/news/News.tsx'))
const Wallet = lazy(() => import('../components/pages/wallet/Wallet.tsx'))

import './app.scss'

const App: FC = () => {
  return (
    <div className='app'>
      <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          <Router>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<MainPage />} />
                <Route path='/converter' element={<CryptoConverter />} />
                <Route path='/news' element={<News />} />
                <Route path='/wallet' element={<Wallet />} />
              </Route>
              <Route path='*' element={<Page404 />} />
            </Routes>
          </Router>
        </Suspense>
      </Provider>
    </div>
  )
}

export default App
