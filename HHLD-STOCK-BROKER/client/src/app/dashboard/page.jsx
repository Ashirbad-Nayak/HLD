// Dashboard.jsx
import React from 'react';
import Sidebar from '../_components/sidebar.jsx';
import StockChart from '../_components/stockchart.jsx';

const Dashboard = () => {
  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-100 dark:bg-gray-900">
    {/* Sidebar */}
    <div className="w-[30%] min-w-[280px] max-w-[400px] border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
      <Sidebar />
    </div>
  
    {/* Main Chart Area */}
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="h-full rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6">
        <StockChart />
      </div>
    </div>
  </div>
  

  );
};

export default Dashboard;