import React from 'react';
import { FaArrowRight, FaCheckCircle, FaPowerOff, FaSpinner } from 'react-icons/fa';

const StatusBox = ({
  keyName,
  statuses,
  isLoading,
  handleShutdown,
  handleStart,
  globalLoading,
  calcPercentage,
  getColorClass
}) => {
  const percentage = calcPercentage(statuses);
  const colorClass = getColorClass(percentage);

  return (
    <div className="bg-gray-800 shadow-xl rounded-xl p-6 flex flex-col items-center">
      <div className="text-2xl font-semibold mb-2 text-center text-indigo-300 flex items-center">
        {keyName}
      </div>
      <div className="w-full h-4 bg-gray-700 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xl font-semibold text-center text-gray-300 mb-4">
        {statuses.filter(Boolean).length}/{statuses.length}
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        {statuses.map((status, i) => (
          <button
            key={i}
            disabled={isLoading(keyName, i) || globalLoading}
            onClick={() => (status ? handleShutdown(keyName, i) : handleStart(keyName, i))}
            className={`text-sm flex items-center justify-center py-1 px-3 rounded-lg transition-colors duration-300 ${
              status ? 'bg-green-600' : 'bg-red-600'
            } text-white disabled:opacity-50`}
          >
            {isLoading(keyName, i) ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <>
                {keyName} {i + 1}{' '}
                {status ? (
                  <FaCheckCircle className="ml-2" />
                ) : (
                  <FaPowerOff className="ml-2" />
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusBox;
