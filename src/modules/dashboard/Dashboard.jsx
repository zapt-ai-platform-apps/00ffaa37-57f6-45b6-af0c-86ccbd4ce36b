import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApps, createApp } from '@/modules/apps/api';
import Layout from '@/shared/components/Layout';
import AppList from '@/modules/apps/AppList';
import AppForm from '@/modules/apps/AppForm';
import useAuth from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  
  useEffect(() => {
    fetchApps();
    
    if (user) {
      setPublicUrl(`${window.location.origin}/public/${user.id}`);
    }
  }, [user]);
  
  const fetchApps = async () => {
    try {
      setLoading(true);
      const userApps = await getApps();
      setApps(userApps);
      setError(null);
    } catch (err) {
      console.error('Error fetching apps:', err);
      Sentry.captureException(err);
      setError('Failed to load apps. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateApp = async (appData) => {
    try {
      setIsCreating(true);
      const newApp = await createApp(appData);
      
      // Navigate to the new app's detail page
      navigate(`/apps/${newApp.id}`);
    } catch (err) {
      console.error('Error creating app:', err);
      Sentry.captureException(err);
      setError('Failed to create app. Please try again.');
      setIsCreating(false);
    }
  };
  
  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert('Public URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      Sentry.captureException(err);
      alert('Failed to copy URL. Please try manually selecting and copying the URL.');
    }
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Apps</h1>
            <p className="mt-1 text-gray-600">
              Track, manage, and grow your apps with ZAPT's traction tools
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)} 
              className="btn-primary cursor-pointer"
              disabled={showAddForm}
            >
              Add New App
            </button>
            
            {user && (
              <div className="relative group">
                <button 
                  onClick={copyPublicUrl}
                  className="btn-secondary cursor-pointer flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Dashboard
                </button>
                <div className="absolute z-10 -left-10 -bottom-16 transform scale-0 transition-transform duration-100 origin-top group-hover:scale-100">
                  <div className="bg-gray-800 text-white p-2 rounded text-xs whitespace-nowrap">
                    Click to copy your public dashboard URL
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New App</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AppForm 
              onSubmit={handleCreateApp} 
              onCancel={() => setShowAddForm(false)}
              isLoading={isCreating}
            />
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
            <button 
              onClick={fetchApps}
              className="ml-2 text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        )}
        
        <AppList
          apps={apps}
          loading={loading}
          onRefresh={fetchApps}
        />
      </div>
    </Layout>
  );
}