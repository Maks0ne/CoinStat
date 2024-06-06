import { FC } from "react";
import Carousel from "../../../features/carousel/Carousel";
import CoinsDataTable from "../../coinsDataTable/CoinsDataTable";

import './mainPage.scss';

const MainPage: FC = () => {
  return (
    <>
      <div className="full-screen">
        <div className="title">
          <h1>"Cryptocurrency is not just a new form of money, but also a key to financial <strong>freedom</strong> that we hold in our hands."</h1>
        </div>
      </div>
      <div className="main-container">
        <div className="slider">
          <Carousel />
        </div>
        <div className="coins-data-table">
          <CoinsDataTable />
        </div>
      </div >
    </>
  )
}

export default MainPage