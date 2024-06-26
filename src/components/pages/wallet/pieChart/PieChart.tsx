import { FC } from "react";
import { useSelector } from 'react-redux';
import { RootState } from "../../../../store/store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2';

import './pieChart.scss'

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: FC = () => {
  const walletResult = useSelector((state: RootState) => state.wallet.walletResult);
  const labels = walletResult.map(item => item.coin.fullName);
  const dataValues = walletResult.map(item => item.amount);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="pieChart">
      <Pie data={data} />
    </div>
  )
}

export default PieChart