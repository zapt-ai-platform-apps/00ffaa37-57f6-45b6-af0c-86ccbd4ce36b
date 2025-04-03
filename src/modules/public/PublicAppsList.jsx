import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getPublicAppById } from '../apps/api';
import * as Sentry from '@sentry/browser';

const PublicAppsList = ({ apps }) => {
  const [expandedApp, setExpandedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const handleAppClick = async (appId) => {
    if (expandedApp === appId) {
      setExpandedApp(null);
      return;
    }
    
    try {
      setLoading(true);
      setDetailError(null);
      // We don't need to fetch additional details since actions are now included in the initial apps data
      setExpandedApp(appId);
    } catch (error) {
      console.error('Error handling app click:', error);
      setDetailError('Unable to load app details');
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDomain = (domain) => {
    if (!domain) return null;
    
    // If domain already has http/https, return as is
    if (domain.startsWith('http://') || domain.startsWith('https://')) {
      return domain;
    }
    
    // Otherwise, add https://
    return `https://${domain}`;
  };

  const visitApp = (e, domain) => {
    e.stopPropagation(); // Prevent expanding/collapsing the app details
    
    if (!domain) return;
    
    const formattedDomain = formatDomain(domain);
    window.open(formattedDomain, '_blank', 'noopener,noreferrer');
  };

  if (apps.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No apps available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Apps</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {apps.map((app) => (
            <li key={app.id}>
              <div 
                className="px-4 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleAppClick(app.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600">{app.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{app.description}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Created {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-4 items-center">
                    {app.domain && (
                      <button
                        onClick={(e) => visitApp(e, app.domain)}
                        className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 py-1 px-3 rounded cursor-pointer transition-colors"
                      >
                        Visit App
                      </button>
                    )}
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{app.userCount || 0}</p>
                      <p className="text-xs text-gray-500">Users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${Number(app.revenue || 0).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                </div>

                {loading && expandedApp === app.id && (
                  <div className="mt-4 py-2">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {detailError && expandedApp === app.id && (
                  <div className="mt-4 text-sm text-red-600">
                    {detailError}
                  </div>
                )}

                {expandedApp === app.id && !loading && !detailError && (
                  <div className="mt-4 border-t pt-4">
                    {app.domain && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">App Domain</h4>
                        <a 
                          href={formatDomain(app.domain)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {app.domain}
                        </a>
                      </div>
                    )}
                    
                    {app.strategy && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Strategy</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{app.strategy}</p>
                      </div>
                    )}
                    
                    {app.actions && app.actions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Action Items</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          {Array.isArray(app.actions) 
                            ? app.actions.map((action, index) => (
                                <li key={action.id || index} className="mb-1">
                                  {action.text}
                                  {action.completed && <span className="ml-2 text-green-600">✓</span>}
                                </li>
                              ))
                            : <li>No actions available</li>
                          }
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PublicAppsList;