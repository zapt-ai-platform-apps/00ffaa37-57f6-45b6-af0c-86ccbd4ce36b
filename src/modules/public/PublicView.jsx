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
import { sampleApps } from './sampleApps';

const PublicView = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        // For the landing page, we'll always use sample apps
        setApps(sampleApps);
        setError(null);
      } catch (err) {
        console.error('Error setting up sample apps:', err);
        Sentry.captureException(err);
        setError('Unable to load apps. Please try again later.');
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
          <PublicAppsList apps={apps} isPublicDashboard={false} />
        )}
      </div>
      
      <FooterSection />
    </div>
  );
};

export default PublicView;