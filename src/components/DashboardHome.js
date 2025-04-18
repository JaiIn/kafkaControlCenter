import React from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  const lineData = {
    labels: ['월', '화', '수', '목', '금'],
    datasets: [{
      label: '방문자 수',
      data: [120, 190, 300, 250, 220],
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.4,
    }],
  };

  const barData = {
    labels: ['A', 'B', 'C', 'D'],
    datasets: [{
      label: '지점 매출',
      data: [500, 700, 300, 400],
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
    }],
  };

  const doughnutData = {
    labels: ['배달', '포장', '매장'],
    datasets: [{
      data: [200, 100, 300],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  const Card = ({ title, children, link }) => (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full md:w-1/3">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="h-48">{children}</div>
      <Link to={link} className="text-blue-500 hover:underline mt-2 inline-block">
        자세히 보기 →
      </Link>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 대시보드 미리보기</h1>
      <p className="mb-8 text-gray-600">사용 가능한 차트를 미리 확인해보세요.</p>
      <div className="flex flex-col md:flex-row gap-6">
        <Card title="선 그래프 (Line)" link="/chart">
          <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Card>
        <Card title="막대 그래프 (Bar)" link="/bar">
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Card>
        <Card title="원형 그래프 (Doughnut)" link="/doughnut">
          <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
