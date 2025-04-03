import React, { useMemo } from 'react';
import { 
  IoPersonOutline, 
  IoCashOutline, 
  IoApps, 
  IoCheckmarkDoneOutline 
} from 'react-icons/io5';

// Hardcoded metrics values for the landing page
const LANDING_PAGE_METRICS = {
  totalApps: 324,
  totalUsers: 15725,
  totalRevenue: 127650.45,
  completedActions: 1893,
  totalActions: 2450
};

export default function PublicMetrics({ apps = [], isLandingPage = false }) {
  const stats = useMemo(() => {
    // Always use hardcoded values for landing page
    if (isLandingPage) {
      return LANDING_PAGE_METRICS;
    }
    
    // Ensure apps is always an array before reducing
    const safeApps = Array.isArray(apps) ? apps : [];
    
    return safeApps.reduce(
      (acc, app) => {
        // Add defensive checks for app and its properties
        if (!app) return acc;
        
        // Safely access properties with fallbacks to 0
        const userCount = typeof app.userCount === 'number' ? app.userCount : 0;
        const revenue = typeof app.revenue === 'number' ? app.revenue : 
                       (typeof app.revenue === 'string' ? parseFloat(app.revenue) || 0 : 0);
        
        // Safely handle actions array
        const actions = Array.isArray(app.actions) ? app.actions : [];
        const completedActions = actions.filter(a => a && a.completed).length;
        
        // Update accumulator
        acc.totalUsers += userCount;
        acc.totalRevenue += revenue;
        acc.completedActions += completedActions;
        acc.totalActions += actions.length;
        
        return acc;
      },
      { totalApps: safeApps.length, totalUsers: 0, totalRevenue: 0, completedActions: 0, totalActions: 0 }
    );
  }, [apps, isLandingPage]);

  const actionCompletionPercentage = stats.totalActions > 0 
    ? Math.round((stats.completedActions / stats.totalActions) * 100) 
    : 0;

  const metrics = [
    {
      title: "Apps Launched",
      value: stats.totalApps,
      icon: IoApps,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-indigo-50"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: IoPersonOutline,
      color: "from-emerald-500 to-green-600",
      bgLight: "bg-green-50"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: IoCashOutline,
      color: "from-purple-500 to-violet-600",
      bgLight: "bg-purple-50"
    },
    {
      title: "Action Completion",
      value: `${actionCompletionPercentage}%`,
      subtext: `${stats.completedActions} of ${stats.totalActions} actions`,
      icon: IoCheckmarkDoneOutline,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      progress: actionCompletionPercentage
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Overall Progress</h2>
        <p className="mt-3 text-xl text-gray-600">Track the collective growth of apps built with ZAPT</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className={`absolute h-1.5 top-0 inset-x-0 bg-gradient-to-r ${metric.color}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {metric.title}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  {metric.subtext && (
                    <p className="mt-1 text-sm text-gray-500">{metric.subtext}</p>
                  )}
                </div>
                <div className={`${metric.bgLight} p-3 rounded-lg`}>
                  <metric.icon className={`h-6 w-6 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`} />
                </div>
              </div>
              
              {metric.progress !== undefined && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full bg-gradient-to-r ${metric.color}`}
                      style={{ width: `${metric.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}