import { FC } from "react"
import { Link } from "react-router-dom"
import { CircleUser } from 'lucide-react';

import './header.scss'

const Header: FC = () => {
  return (
    <div className="header">
      <Link to={'/'} aria-label="Home"><p>Home</p></Link>
      <Link to={'/converter'} aria-label="Converter"><p>Converter</p></Link>
      <Link to={'/news'} aria-label="News"><p>News</p></Link>
      <Link to={'/wallet'} aria-label="Wallet"><p>Wallet</p></Link>
      <Link to={'/authorization'} aria-label="Authorization"><p><CircleUser className="login-icon" /></p></Link>
    </div>
  )
}

export default Header