import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/shared/components/Layout';
import MetricsForm from '@/modules/metrics/MetricsForm';
import StrategySection from '@/modules/strategy/StrategySection';
import ActionsSection from '@/modules/actions/ActionsSection';
import { getAppById, updateApp, deleteApp } from '@/modules/apps/api';
import * as Sentry from '@sentry/browser';

export default function AppDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetchApp();
  }, [id]);

  const fetchApp = async () => {
    try {
      setLoading(true);
      const appData = await getAppById(id);
      setApp(appData);
      setError(null);
    } catch (err) {
      console.error('Error fetching app:', err);
      Sentry.captureException(err);
      setError('Failed to load app details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMetricsUpdate = async (metricsData) => {
    if (!app) return;
    
    try {
      setLoading(true);
      const updatedApp = await updateApp(app.id, {
        ...app,
        ...metricsData
      });
      setApp(updatedApp);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating metrics:', err);
      Sentry.captureException(err);
      setError('Failed to update metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApp = async () => {
    try {
      setLoading(true);
      await deleteApp(app.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting app:', err);
      Sentry.captureException(err);
      setError('Failed to delete app. Please try again.');
    } finally {
      setLoading(false);
      setDeleteConfirmation(false);
    }
  };

  if (loading && !app) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="card p-8 text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading app details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
          <Link to="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  if (!app) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">App not found.</p>
            <Link to="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 flex items-center">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2">{app.name}</h1>
            <p className="text-gray-600">{app.description}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Metrics'}
            </button>
            
            {!isEditing && (
              <button 
                onClick={() => setDeleteConfirmation(true)}
                className="btn-danger"
              >
                Delete App
              </button>
            )}
          </div>
        </div>

        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
              <p className="mb-6">Are you sure you want to delete {app.name}? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setDeleteConfirmation(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteApp}
                  className="btn-danger"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete App'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Users</h3>
            <p className="text-3xl font-bold">{app.userCount || 0}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Revenue</h3>
            <p className="text-3xl font-bold">${app.revenue || 0}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Actions</h3>
            <p className="text-3xl font-bold">
              <span className="text-green-600">{(app.actions || []).filter(a => a.completed).length}</span>
              {" / "}
              <span>{(app.actions || []).length}</span>
            </p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Update Metrics</h2>
            <MetricsForm 
              initialData={app} 
              onSubmit={handleMetricsUpdate} 
              onCancel={() => setIsEditing(false)}
              isLoading={loading}
            />
          </div>
        ) : (
          <>
            <StrategySection 
              app={app} 
              onUpdateApp={(updatedApp) => setApp(updatedApp)} 
            />
            
            <ActionsSection 
              app={app} 
              onUpdateApp={(updatedApp) => setApp(updatedApp)} 
            />
          </>
        )}
      </div>
    </Layout>
  );
}