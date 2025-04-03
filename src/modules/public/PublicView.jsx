import React, { useState, useEffect } from 'react';
import { getPublicApps } from '@/modules/apps/api';
import PublicHeader from './PublicHeader';
import PublicAppsList from './PublicAppsList';
import PublicMetrics from './PublicMetrics';
import Hero from './Hero';
import FeatureSection from './FeatureSection';
import TestimonialSection from './TestimonialSection';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <PublicHeader />
      <Hero />
      
      {error ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-md bg-red-50 p-4 my-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <PublicMetrics apps={apps} />
            <FeatureSection />
            <PublicAppsList apps={apps} />
            <TestimonialSection />
          </div>
        </>
      )}
      <FooterSection />
    </div>
  );
};

export default PublicView;