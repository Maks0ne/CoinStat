import { FC } from "react"
import { Outlet } from "react-router-dom"
import Header from "../header/Header"
import './layout.scss'

const Layout: FC = () => {
  return (
    <div className="layout">
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout