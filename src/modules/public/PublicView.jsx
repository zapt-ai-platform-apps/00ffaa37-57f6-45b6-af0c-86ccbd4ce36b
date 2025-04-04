import React, { useState, useEffect } from 'react';
import { getPublicApps } from '@/modules/apps/api';
import PublicHeader from './PublicHeader';
import PublicAppsList from './PublicAppsList';
import PublicMetrics from './PublicMetrics';
import Hero from './Hero';
import FeatureSection from './FeatureSection';
import FooterSection from './FooterSection';
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
        // API will now handle requests without userId parameter
        const data = await getPublicApps();
        console.log('Fetched public apps:', data);
        
        // Ensure actions is properly parsed for each app
        const processedApps = data.map(app => {
          // Ensure actions is an array
          if (!app.actions) {
            app.actions = [];
          } else if (typeof app.actions === 'string') {
            try {
              app.actions = JSON.parse(app.actions);
            } catch (e) {
              console.error('Error parsing actions for app:', app.id, e);
              app.actions = [];
            }
          }
          return app;
        });
        
        setApps(processedApps || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching public apps:', err);
        Sentry.captureException(err);
        setError('Unable to load apps. Please try again later.');
        // Use empty array for apps on error
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <PublicHeader />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Always use hardcoded metrics for the landing page */}
        <PublicMetrics isLandingPage={true} />
        <FeatureSection />
        
        {error ? (
          <div className="rounded-md bg-red-50 p-6 my-6 text-center">
            <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Apps</h2>
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <PublicAppsList apps={apps} />
        )}
      </div>
      
      <FooterSection />
    </div>
  );
};

export default PublicView;