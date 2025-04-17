// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chart from './components/Chart';
import BarChart from './components/BarChart';
import DoughnutChart from './components/DoughnutChart';
import DashboardHome from './components/DashboardHome';
import KafkaStatus from './components/KafkaStatus';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="App p-4">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/bar" element={<BarChart />} /> 
          <Route path="/doughnut" element={<DoughnutChart />} /> 
          <Route path="/kafka" element={<KafkaStatus />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

