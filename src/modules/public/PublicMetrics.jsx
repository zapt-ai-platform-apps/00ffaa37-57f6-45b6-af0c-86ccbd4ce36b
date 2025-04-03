import React, { useMemo } from 'react';

export default function PublicMetrics({ apps = [] }) {
  const stats = useMemo(() => {
    // Ensure apps is always an array before reducing
    const safeApps = Array.isArray(apps) ? apps : [];
    
    return safeApps.reduce(
      (acc, app) => {
        acc.totalUsers += app.userCount || 0;
        acc.totalRevenue += Number(app.revenue) || 0;
        acc.completedActions += (app.actions || []).filter(a => a.completed).length;
        acc.totalActions += (app.actions || []).length;
        return acc;
      },
      { totalApps: safeApps.length, totalUsers: 0, totalRevenue: 0, completedActions: 0, totalActions: 0 }
    );
  }, [apps]);

  const actionCompletionPercentage = stats.totalActions > 0 
    ? Math.round((stats.completedActions / stats.totalActions) * 100) 
    : 0;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-8">Overall Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Apps Launched</p>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.totalApps}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Users</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Revenue</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">${stats.totalRevenue}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Action Completion</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">{actionCompletionPercentage}%</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats.completedActions} of {stats.totalActions} actions
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-amber-600 h-2.5 rounded-full" 
              style={{ width: `${actionCompletionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}