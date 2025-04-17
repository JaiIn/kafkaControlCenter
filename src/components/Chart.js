import React from 'react';
import { Bar } from 'react-chartjs-2';  
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],  
    datasets: [
      {
        label: 'Monthly Sales',  
        data: [65, 59, 80, 81, 56, 55],  
        backgroundColor: 'rgba(255, 99, 132, 0.2)',  
        borderColor: 'rgba(255, 99, 132, 1)', 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,  
    plugins: {
      legend: {
        position: 'top',  
      },
      tooltip: {
        enabled: true, 
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />  
    </div>
  );
};

export default Chart;
