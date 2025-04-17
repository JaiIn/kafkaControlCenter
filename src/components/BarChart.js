import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
  datasets: [
    {
      label: '월별 매출',
      data: [100000, 150000, 130000, 180000, 240000, 210000, 260000],
      fill: false,
      borderColor: 'rgba(255, 99, 132, 1)',
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderColor: 'rgba(255, 99, 132, 1)',
      pointRadius: 5,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '월별 매출 추이 (선 그래프)',
    },
  },
};

const Chart = () => {
  return (
    <div className="p-6">
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart;
