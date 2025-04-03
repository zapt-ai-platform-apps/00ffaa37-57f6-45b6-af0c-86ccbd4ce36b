import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TractionSummary({ apps = [] }) {
  const stats = useMemo(() => {
    // Ensure apps is always an array before reducing
    const safeApps = Array.isArray(apps) ? apps : [];
    
    return safeApps.reduce(
      (acc, app) => {
        acc.totalUsers += app.userCount || 0;
        acc.totalRevenue += Number(app.revenue) || 0;
        acc.completedActions += (app.actions || []).filter(a => a.completed).length;
        acc.pendingActions += (app.actions || []).filter(a => !a.completed).length;
        acc.totalActions += (app.actions || []).length;
        return acc;
      },
      { totalApps: safeApps.length, totalUsers: 0, totalRevenue: 0, completedActions: 0, pendingActions: 0, totalActions: 0 }
    );
  }, [apps]);

  const actionCompletionPercentage = stats.totalActions > 0 
    ? Math.round((stats.completedActions / stats.totalActions) * 100) 
    : 0;

  const chartData = {
    labels: ['Apps', 'Users', 'Revenue ($)', 'Completed Actions', 'Pending Actions'],
    datasets: [
      {
        label: 'Traction Metrics',
        data: [
          stats.totalApps,
          stats.totalUsers,
          stats.totalRevenue,
          stats.completedActions,
          stats.pendingActions
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Overall Traction Metrics',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Apps Launched</p>
            <p className="text-2xl font-bold">{stats.totalApps}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600">Total Revenue</p>
            <p className="text-2xl font-bold">${stats.totalRevenue}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-600">Action Completion</p>
            <p className="text-2xl font-bold">{actionCompletionPercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className="bg-amber-600 h-2.5 rounded-full" 
                style={{ width: `${actionCompletionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.completedActions} of {stats.totalActions} actions
            </p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}