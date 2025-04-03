import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/modules/auth/hooks/useAuth';
import { getApps, createApp, updatePublicStatus } from '@/modules/apps/api';
import Layout from '@/shared/components/Layout';
import AppList from '@/modules/apps/AppList';
import AppForm from '@/modules/apps/AppForm';
import * as Sentry from '@sentry/browser';
import { IoShareSocialOutline } from 'react-icons/io5';

export default function Dashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingStatus, setSharingStatus] = useState('idle'); // idle, loading, success, error
  const navigate = useNavigate();

  const fetchApps = async () => {
    try {
      setLoading(true);
      const fetchedApps = await getApps();
      console.log('Fetched apps:', fetchedApps);
      setApps(fetchedApps);
      setError(null);
    } catch (err) {
      console.error('Error fetching apps:', err);
      setError('Failed to load your apps. Please try again.');
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCreateApp = async (appData) => {
    try {
      setIsSubmitting(true);
      await createApp(appData);
      await fetchApps();
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating app:', err);
      Sentry.captureException(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppClick = (appId) => {
    navigate(`/apps/${appId}`);
  };

  const toggleShareDashboard = async () => {
    if (!user?.id) return;
    
    try {
      setSharingStatus('loading');
      
      // Get current public status of apps
      const anyPublic = apps.some(app => app.isPublic);
      
      // If no apps are public, update all to be public
      if (!anyPublic) {
        const updatePromises = apps.map(app => 
          updatePublicStatus(app.id, true)
        );
        await Promise.all(updatePromises);
        await fetchApps();
      }
      
      // Generate share URL
      const shareUrl = `${window.location.origin}/public/${user.id}`;
      setShareUrl(shareUrl);
      setShowShareModal(true);
      setSharingStatus('success');
    } catch (err) {
      console.error('Error sharing dashboard:', err);
      Sentry.captureException(err);
      setSharingStatus('error');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Could not copy text:', err);
      Sentry.captureException(err);
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Apps</h1>
            <div className="flex space-x-4">
              <button
                onClick={toggleShareDashboard}
                disabled={sharingStatus === 'loading' || apps.length === 0}
                className="flex items-center space-x-2 btn-secondary cursor-pointer"
              >
                <IoShareSocialOutline className="w-5 h-5" />
                <span>Share Dashboard</span>
              </button>
              
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary cursor-pointer"
              >
                Add New App
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 my-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {isCreating ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Add New App</h2>
              <AppForm 
                onSubmit={handleCreateApp}
                isSubmitting={isSubmitting}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          ) : (
            <AppList
              apps={apps}
              onAppClick={handleAppClick}
              loading={loading}
            />
          )}

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Share Your Dashboard</h3>
                {sharingStatus === 'error' ? (
                  <p className="text-red-600 mb-4">There was an error creating your public dashboard.</p>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">
                      Share this link to let others see your app progress:
                    </p>
                    <div className="flex mb-4">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="input flex-grow"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="ml-2 btn-primary cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Note: This makes your apps visible on your public dashboard. You can make individual apps private in their settings.
                    </p>
                  </>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="btn-secondary cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}