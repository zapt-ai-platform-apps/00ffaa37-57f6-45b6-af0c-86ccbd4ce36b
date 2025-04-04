import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../auth/hooks/useAuth';
import { supabase } from '@/supabaseClient';
import AppList from '../apps/AppList';
import AppForm from '../apps/AppForm';
import Layout from '../../shared/components/Layout';
import * as Sentry from '@sentry/browser';
import { createApp } from '../apps/api';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppForm, setShowAppForm] = useState(false);
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [shareUrlCopied, setShareUrlCopied] = useState(false);
  const [isCreatingApp, setIsCreatingApp] = useState(false);

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

  const handleSubmit = async (formData) => {
    try {
      setIsCreatingApp(true);
      const newApp = await createApp(formData);
      setApps([...apps, newApp]);
      setShowAppForm(false);
    } catch (err) {
      console.error('Error creating app:', err);
      Sentry.captureException(err);
      setError('Failed to create app: ' + err.message);
    } finally {
      setIsCreatingApp(false);
    }
  };

  const handleAppDeleted = (deletedAppId) => {
    setApps(apps.filter(app => app.id !== deletedAppId));
  };

  const getPublicShareUrl = () => {
    if (!user || !user.id) return '';
    return `${window.location.origin}/public/${user.id}`;
  };

  const copyShareUrl = () => {
    const url = getPublicShareUrl();
    if (!url) return;
    
    navigator.clipboard.writeText(url)
      .then(() => {
        setShareUrlCopied(true);
        setTimeout(() => setShareUrlCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
        Sentry.captureException(err);
      });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Traction Dashboard</h1>
            <p className="text-gray-600 mt-2">Track and grow your apps' traction metrics</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={() => setShowShareUrl(!showShareUrl)}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md font-medium hover:bg-indigo-200 transition duration-150 cursor-pointer"
            >
              Share Dashboard
            </button>
            <button
              onClick={() => setShowAppForm(!showAppForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition duration-150 cursor-pointer"
            >
              {showAppForm ? 'Cancel' : '+ Add New App'}
            </button>
          </div>
        </div>
        
        {showAppForm && (
          <div className="mb-8">
            <AppForm 
              onSubmit={handleSubmit} 
              onCancel={() => setShowAppForm(false)} 
              isLoading={isCreatingApp}
            />
          </div>
        )}
        
        {showShareUrl && (
          <div className="card mb-8">
            <h3 className="text-lg font-medium mb-2">Your Public Dashboard URL</h3>
            <p className="mb-2 text-sm text-gray-600">
              Share this link with others to show all your public apps.
            </p>
            
            <div className="flex items-center">
              <input
                type="text"
                value={getPublicShareUrl()}
                readOnly
                className="input box-border border-gray-300 flex-grow"
              />
              <button
                onClick={copyShareUrl}
                className="ml-2 btn-primary cursor-pointer"
              >
                {shareUrlCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
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