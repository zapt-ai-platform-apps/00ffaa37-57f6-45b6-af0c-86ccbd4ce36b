import React, { useState, useEffect } from 'react';
import { getPublicApps } from '@/modules/apps/api';
import PublicHeader from './PublicHeader';
import PublicAppsList from './PublicAppsList';
import PublicMetrics from './PublicMetrics';
import LoadingPage from '@/shared/components/LoadingPage';
import * as Sentry from '@sentry/browser';

const PublicView = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const data = await getPublicApps();
        console.log('Fetched public apps:', data);
        setApps(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching public apps:', err);
        setError('Failed to load apps. Please try again later.');
        Sentry.captureException(err);
        // Ensure apps is set to an empty array on error
        setApps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PublicHeader />
      
      {error ? (
        <div className="rounded-md bg-red-50 p-4 my-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <PublicMetrics apps={apps} />
          <PublicAppsList apps={apps} />
        </>
      )}
    </div>
  );
};

export default PublicView;