import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-6 justify-center">
        <li><Link to="/" className="hover:underline">대시보드 홈</Link></li>
        <li>
          <Link to="/chart" className="hover:underline">Line Chart</Link>
        </li>
        <li>
          <Link to="/bar" className="hover:underline">Bar Chart</Link>
        </li>
        <li>
            <Link to="/doughnut" className="hover:underline">Doughnut Chart</Link>
        </li>
        <li><Link to="/kafka" className="hover:underline">Kafka</Link></li> 
      </ul>
    </nav>
  );
};

export default Navbar;
