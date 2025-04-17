import React from 'react';
import { FaTerminal } from 'react-icons/fa';

const LogBox = ({ messages = [] }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl transform transition-transform duration-500 hover:scale-105">
      <h2 className="text-xl font-semibold mb-4 text-green-400">로그 메시지</h2>
      <ul className="space-y-2 text-gray-300 max-h-64 overflow-auto pr-2">
        {messages.map((msg, index) => (
          <li key={index} className="text-sm flex items-center text-green-400">
            <FaTerminal className="mr-2" />
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogBox;
