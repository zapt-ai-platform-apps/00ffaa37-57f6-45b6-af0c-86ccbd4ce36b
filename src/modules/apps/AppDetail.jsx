import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppById, updateApp, deleteApp } from './api';
import Layout from '@/shared/components/Layout';
import AppForm from './AppForm';
import MetricsForm from '@/modules/metrics/MetricsForm';
import ActionsSection from '@/modules/actions/ActionsSection';
import * as Sentry from '@sentry/browser';
import useAuth from '@/modules/auth/hooks/useAuth';

export default function AppDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [shareUrlCopied, setShareUrlCopied] = useState(false);

  useEffect(() => {
    fetchAppData();
  }, [id]);

  const fetchAppData = async () => {
    try {
      setLoading(true);
      const appData = await getAppById(id);
      setApp(appData);
      setError(null);
    } catch (err) {
      console.error('Error fetching app data:', err);
      Sentry.captureException(err);
      setError('Failed to load app details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApp = async (updatedData) => {
    try {
      setUpdating(true);
      // Merge with existing app data to avoid losing fields not in the form
      const updatedApp = await updateApp(id, {
        ...app,
        ...updatedData
      });
      setApp(updatedApp);
      setShowEditForm(false);
      setError(null);
    } catch (err) {
      console.error('Error updating app:', err);
      Sentry.captureException(err);
      setError('Failed to update app. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateMetrics = async (metrics) => {
    try {
      setUpdating(true);
      const updatedApp = await updateApp(id, {
        ...app,
        userCount: parseInt(metrics.userCount),
        revenue: parseFloat(metrics.revenue)
      });
      setApp(updatedApp);
      setError(null);
    } catch (err) {
      console.error('Error updating metrics:', err);
      Sentry.captureException(err);
      setError('Failed to update metrics. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStrategy = async (strategy) => {
    try {
      setUpdating(true);
      const updatedApp = await updateApp(id, {
        ...app,
        strategy
      });
      setApp(updatedApp);
      setError(null);
    } catch (err) {
      console.error('Error updating strategy:', err);
      Sentry.captureException(err);
      setError('Failed to update strategy. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateActions = async (actions) => {
    try {
      setUpdating(true);
      const updatedApp = await updateApp(id, {
        ...app,
        actions
      });
      setApp(updatedApp);
      setError(null);
    } catch (err) {
      console.error('Error updating actions:', err);
      Sentry.captureException(err);
      setError('Failed to update actions. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteApp = async () => {
    if (!window.confirm('Are you sure you want to delete this app? This action cannot be undone.')) {
      return;
    }
    
    try {
      setUpdating(true);
      await deleteApp(id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting app:', err);
      Sentry.captureException(err);
      setError('Failed to delete app. Please try again.');
      setUpdating(false);
    }
  };

  const toggleAppPublic = async () => {
    try {
      setUpdating(true);
      const updatedApp = await updateApp(id, {
        ...app,
        isPublic: !app.isPublic
      });
      setApp(updatedApp);
      setError(null);
    } catch (err) {
      console.error('Error updating public status:', err);
      Sentry.captureException(err);
      setError('Failed to update app visibility. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getPublicShareUrl = () => {
    // Create a URL for the user's public dashboard
    return `${window.location.origin}/public/${user.id}`;
  };

  const copyShareUrl = () => {
    const url = getPublicShareUrl();
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

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 btn-primary cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  if (!app) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p>App not found.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 btn-primary cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
              {app.domain && (
                <a 
                  href={app.domain.startsWith('http') ? app.domain : `https://${app.domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-indigo-600 hover:text-indigo-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            <p className="text-gray-600">{app.description}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <button 
              onClick={() => setShowEditForm(true)}
              className="btn-secondary cursor-pointer"
              disabled={updating}
            >
              Edit App
            </button>
            <button 
              onClick={handleDeleteApp}
              className="btn-danger cursor-pointer"
              disabled={updating}
            >
              Delete
            </button>
          </div>
        </div>

        {showEditForm && (
          <div className="mb-6 card">
            <h2 className="text-lg font-semibold mb-4">Edit App Details</h2>
            <AppForm 
              app={app} 
              onSubmit={handleUpdateApp} 
              onCancel={() => setShowEditForm(false)}
              isLoading={updating}
            />
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Public Dashboard</h2>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="togglePublic"
                  checked={app.isPublic}
                  onChange={toggleAppPublic}
                  disabled={updating}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="togglePublic" className="ml-2 text-sm font-medium text-gray-700">
                  Make this app public
                </label>
              </div>
              
              <button 
                onClick={() => setShowShareUrl(!showShareUrl)}
                className="btn-secondary cursor-pointer"
                disabled={updating}
              >
                Share Dashboard
              </button>
            </div>
          </div>
          
          {showShareUrl && (
            <div className="card mb-4">
              <h3 className="text-lg font-medium mb-2">Your Public Dashboard URL</h3>
              <p className="mb-2 text-sm text-gray-600">
                Share this link with others to show your app's progress.
                <br />
                Only apps marked as public will be visible to others.
              </p>
              
              <div className="flex items-center">
                <input
                  type="text"
                  value={getPublicShareUrl()}
                  readOnly
                  className="input border-gray-300 flex-grow"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricsForm 
            app={app} 
            onSubmit={handleUpdateMetrics}
            isLoading={updating}
          />

          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">App Growth</h2>
            <div className="text-center py-4 text-gray-500">
              Charts coming soon...
            </div>
          </div>
        </div>

        <ActionsSection 
          app={app} 
          onUpdateStrategy={handleUpdateStrategy} 
          onUpdateActions={handleUpdateActions}
          isLoading={updating}
        />
      </div>
    </Layout>
  );
}