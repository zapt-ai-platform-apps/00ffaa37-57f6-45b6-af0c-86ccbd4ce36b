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
          <div className="rounded-xl bg-white shadow-md p-8 my-6 text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Dashboard Not Available</h2>
            <p className="text-gray-600 mb-6">{error || "The requested dashboard could not be found or is private."}</p>
            <Link to="/" className="inline-block btn-primary cursor-pointer">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
          <div className="text-center mb-10">
            <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">App Traction Dashboard</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track the progress and growth of my apps built with ZAPT
            </p>
          </div>
          
          <PublicMetrics apps={apps} />
        </div>
        
        {apps && apps.length > 0 ? (
          <PublicAppsList apps={apps} />
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="bg-amber-50 inline-block p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-amber-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Public Apps Available</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              The owner of this dashboard hasn't made any apps public yet. Check back later for updates.
            </p>
          </div>
        )}
      </div>
      
      <FooterSection />
    </div>
  );
};

export default PublicDashboard;