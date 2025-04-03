import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../auth/hooks/useAuth';
import { supabase } from '@/supabaseClient';
import AppList from '../apps/AppList';
import AppForm from '../apps/AppForm';
import Layout from '../../shared/components/Layout';
import AdminTools from './AdminTools';
import * as Sentry from '@sentry/browser';

const Dashboard = () => {
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }
      
      const response = await fetch('/api/apps', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch apps');
      }
      
      const data = await response.json();
      setApps(data);
    } catch (err) {
      console.error('Error fetching apps:', err);
      Sentry.captureException(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppCreated = (newApp) => {
    setApps([...apps, newApp]);
    setShowAppForm(false);
  };

  const handleAppDeleted = (deletedAppId) => {
    setApps(apps.filter(app => app.id !== deletedAppId));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Traction Dashboard</h1>
            <p className="text-gray-600 mt-2">Track and grow your apps' traction metrics</p>
          </div>
          <button
            onClick={() => setShowAppForm(!showAppForm)}
            className="mt-4 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition duration-150 cursor-pointer"
          >
            {showAppForm ? 'Cancel' : '+ Add New App'}
          </button>
        </div>
        
        {/* Admin Tools - only shown to users who need it */}
        <AdminTools />
        
        {showAppForm && (
          <div className="mb-8">
            <AppForm onAppCreated={handleAppCreated} onCancel={() => setShowAppForm(false)} />
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <AppList 
          apps={apps} 
          loading={loading} 
          onAppDeleted={handleAppDeleted} 
          onRefresh={fetchApps} 
        />
      </div>
    </Layout>
  );
};

export default Dashboard;