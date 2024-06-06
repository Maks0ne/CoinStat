import { FC } from "react"
import { Link } from "react-router-dom"

import './header.scss'

const Header: FC = () => {
  return (
    <div className="header">
      <Link to={'/'}><p>Home</p></Link>
      <Link to={'/converter'}><p>Converter</p></Link>
      <Link to={'/news'}><p>News</p></Link>
      <Link to={'/wallet'}><p>Wallet</p></Link>
    </div>
  )
}

export default Header