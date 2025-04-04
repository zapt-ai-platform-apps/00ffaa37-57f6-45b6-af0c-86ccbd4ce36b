import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserPublicDashboard } from '@/modules/apps/api';
import PublicHeader from './PublicHeader';
import PublicMetrics from './PublicMetrics';
import PublicAppsList from './PublicAppsList';
import FooterSection from './FooterSection';
import LoadingPage from '@/shared/components/LoadingPage';
import * as Sentry from '@sentry/browser';

const PublicDashboard = () => {
  const { userId } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getUserPublicDashboard(userId);
        console.log('Fetched public dashboard for user:', userId, data);
        
        // Ensure actions is properly parsed for each app
        if (data.apps) {
          const processedApps = data.apps.map(app => {
            // Ensure actions is an array
            if (!app.actions) {
              console.log(`App ${app.id} has no actions, setting empty array`);
              app.actions = [];
            } else if (typeof app.actions === 'string') {
              try {
                console.log(`App ${app.id} has string actions, parsing JSON`);
                app.actions = JSON.parse(app.actions);
              } catch (e) {
                console.error('Error parsing actions for app:', app.id, e);
                app.actions = [];
              }
            } else if (!Array.isArray(app.actions)) {
              console.log(`App ${app.id} has non-array actions, converting`);
              try {
                const actionsStr = JSON.stringify(app.actions);
                app.actions = JSON.parse(actionsStr);
                if (!Array.isArray(app.actions)) {
                  app.actions = [];
                }
              } catch (e) {
                console.error('Error converting actions for app:', app.id, e);
                app.actions = [];
              }
            }
            return app;
          });
          
          data.apps = processedApps;
        }
        
        setDashboard(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching public dashboard:', err);
        setError('Failed to load dashboard. Please try again later.');
        Sentry.captureException(err);
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboard();
    }
  }, [userId]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-md bg-red-50 p-6 my-6 text-center">
            <h2 className="text-lg font-medium text-red-800 mb-2">Dashboard Not Available</h2>
            <p className="text-red-700">{error || "The requested dashboard could not be found or is private."}</p>
            <Link to="/" className="mt-4 inline-block btn-primary cursor-pointer">
              Return to Home
            </Link>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  const { apps, metrics } = dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <PublicHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">App Traction Dashboard</h1>
          <p className="text-xl text-gray-600">
            Track the progress and growth of my apps built with ZAPT
          </p>
        </div>
        
        <PublicMetrics apps={apps} />
        
        {apps && apps.length > 0 ? (
          <PublicAppsList apps={apps} />
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Public Apps Available</h2>
            <p className="text-gray-600">
              The owner of this dashboard hasn't made any apps public yet.
            </p>
          </div>
        )}
      </div>
      
      <FooterSection />
    </div>
  );
};

export default PublicDashboard;