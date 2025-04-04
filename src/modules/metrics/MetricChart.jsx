import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getMetricHistory } from './api';
import * as Sentry from '@sentry/browser';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MetricChart({ appId, metricType, title, color = 'rgb(75, 192, 192)' }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMetricHistory() {
      if (!appId) return;
      
      try {
        setLoading(true);
        console.log(`Fetching ${metricType} history for app ${appId}`);
        const history = await getMetricHistory(appId, metricType);
        
        // If we have no data, create empty chart
        if (!history || history.length === 0) {
          console.log(`No ${metricType} history data available`);
          setChartData({
            labels: [],
            datasets: [{
              label: title,
              data: [],
              borderColor: color,
              backgroundColor: `${color.replace('rgb', 'rgba').replace(')', ', 0.2)')}`,
              tension: 0.2
            }]
          });
          return;
        }
        
        console.log(`Got ${history.length} history records for ${metricType}`);
        
        // Sort by date (oldest first)
        const sortedHistory = [...history].sort((a, b) => 
          new Date(a.recordedAt) - new Date(b.recordedAt)
        );
        
        const labels = sortedHistory.map(item => 
          format(new Date(item.recordedAt), 'MMM d, yyyy')
        );
        
        const dataValues = sortedHistory.map(item => 
          parseFloat(item.value)
        );
        
        setChartData({
          labels,
          datasets: [{
            label: title,
            data: dataValues,
            borderColor: color,
            backgroundColor: `${color.replace('rgb', 'rgba').replace(')', ', 0.2)')}`,
            tension: 0.2,
            fill: true
          }]
        });
        
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${metricType} chart data:`, err);
        Sentry.captureException(err);
        setError(`Failed to load ${title.toLowerCase()} chart.`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMetricHistory();
  }, [appId, metricType, title, color]);
  
  if (loading) {
    return (
      <div className="animate-pulse h-64 bg-gray-100 rounded-md flex items-center justify-center" role="status">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-red-50 rounded-md p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (!chartData || chartData.labels.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-md p-4">
        <p className="text-gray-500">No {title.toLowerCase()} data available yet.</p>
        <p className="text-gray-400 text-sm mt-2">Update your metrics to start tracking.</p>
      </div>
    );
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (metricType === 'revenue') {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            } else {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (metricType === 'revenue') {
              return '$' + value;
            }
            return value;
          }
        }
      }
    }
  };
  
  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}