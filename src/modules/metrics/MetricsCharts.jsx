import React from 'react';
import MetricChart from './MetricChart';

export default function MetricsCharts({ appId }) {
  if (!appId) {
    return <div className="text-gray-500">Unable to load charts: Missing app ID</div>;
  }
  
  return (
    <div className="card md:col-span-2">
      <h2 className="text-lg font-semibold mb-4">App Growth</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <MetricChart 
            appId={appId} 
            metricType="user_count" 
            title="User Growth" 
            color="rgb(59, 130, 246)" // blue
          />
        </div>
        <div>
          <MetricChart 
            appId={appId} 
            metricType="revenue" 
            title="Revenue Growth ($)" 
            color="rgb(16, 185, 129)" // green
          />
        </div>
      </div>
    </div>
  );
}