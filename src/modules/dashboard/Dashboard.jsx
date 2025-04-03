import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/modules/auth/hooks/useAuth';
import Layout from '@/shared/components/Layout';
import AppList from '@/modules/apps/AppList';
import AppForm from '@/modules/apps/AppForm';
import TractionSummary from '@/modules/dashboard/TractionSummary';
import { getApps, createApp } from '@/modules/apps/api';
import * as Sentry from '@sentry/browser';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppForm, setShowAppForm] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const appData = await getApps();
      setApps(appData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching apps:', err);
      Sentry.captureException(err);
      setError('Failed to load apps. Please try again.');
      // Ensure apps is set to an empty array on error
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApp = async (appData) => {
    try {
      setLoading(true);
      const newApp = await createApp(appData);
      setApps([...apps, newApp]);
      setShowAppForm(false);
    } catch (err) {
      console.error('Error creating app:', err);
      Sentry.captureException(err);
      setError('Failed to create app. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Traction Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button 
              onClick={signOut} 
              className="btn-secondary text-sm cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        <TractionSummary apps={apps} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Apps</h2>
            <button 
              onClick={() => setShowAppForm(true)}
              className="btn-primary cursor-pointer"
            >
              Add New App
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {showAppForm && (
            <div className="mb-6 card">
              <AppForm 
                onSubmit={handleCreateApp} 
                onCancel={() => setShowAppForm(false)}
                isLoading={loading}
              />
            </div>
          )}

          <AppList 
            apps={apps} 
            loading={loading} 
            onRefresh={fetchApps} 
          />
        </div>
      </div>
    </Layout>
  );
}