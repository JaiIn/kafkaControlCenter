import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['배달', '포장', '매장'],
  datasets: [
    {
      label: '판매 비율',
      data: [300, 150, 100],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: '판매 채널 비율 (원형 그래프)',
    },
  },
};

const DoughnutChart = () => {
  return (
    <div className="p-6 max-w-md mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
