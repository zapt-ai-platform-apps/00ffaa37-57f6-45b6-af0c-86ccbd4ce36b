import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApps } from '@/modules/apps/api';
import PublicHeader from './PublicHeader';
import PublicMetrics from './PublicMetrics';
import PublicAppsList from './PublicAppsList';
import * as Sentry from '@sentry/browser';

export default function PublicView() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const appData = await getApps();
      setApps(appData);
      setError(null);
    } catch (err) {
      console.error('Error fetching apps:', err);
      Sentry.captureException(err);
      setError('Failed to load apps data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Building In Public
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tracking my journey of building traction for multiple apps created with ZAPT within a 4-week timeframe.
          </p>
          <div className="mt-6">
            <Link to="/login" className="btn-primary">
              Sign In to Manage Apps
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-8 max-w-3xl mx-auto">
            {error}
            <button 
              onClick={fetchApps}
              className="ml-2 underline"
            >
              Try Again
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading traction data...</p>
          </div>
        ) : (
          <>
            <PublicMetrics apps={apps} />
            <PublicAppsList apps={apps} />
          </>
        )}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Built with <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">ZAPT</a>
          </p>
        </div>
      </footer>
    </div>
  );
}