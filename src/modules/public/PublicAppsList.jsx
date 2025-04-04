import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import * as Sentry from '@sentry/browser';
import { IoArrowDown, IoArrowUp, IoGlobeOutline, IoCheckmarkCircle } from 'react-icons/io5';

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

  const renderAppActions = (app) => {
    console.log('Rendering actions for app:', app.id, 'Actions:', app.actions);
    
    // Ensure app.actions is an array
    const actions = Array.isArray(app.actions) ? app.actions : [];
    
    if (actions.length === 0) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Action Items</h4>
          <p className="text-gray-500">No actions available for this app.</p>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Action Items</h4>
        <ul className="space-y-2">
          {actions.map((action, index) => (
            <li key={action.id || index} className="flex items-center">
              {action.completed ? (
                <IoCheckmarkCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full flex-shrink-0 mr-2"></div>
              )}
              <span className={`${action.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                {action.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (!apps || apps.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No apps available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Apps</h2>
        <p className="mt-3 text-xl text-gray-600">Discover and explore apps built with ZAPT</p>
      </div>
      
      <div className="space-y-6">
        {apps.map((app) => (
          <div 
            key={app.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div 
              className="p-6 cursor-pointer"
              onClick={() => handleAppClick(app.id)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold text-indigo-600">{app.name}</h3>
                    {app.domain && (
                      <a
                        href={formatDomain(app.domain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        title={app.domain}
                      >
                        <IoGlobeOutline className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-gray-600">{app.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Created {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                  {app.domain && (
                    <button
                      onClick={(e) => visitApp(e, app.domain)}
                      className="btn-primary cursor-pointer flex-shrink-0"
                    >
                      Visit App
                    </button>
                  )}
                  
                  <div className="flex gap-6">
                    <div className="text-center px-4 py-2 bg-indigo-50 rounded-lg">
                      <p className="text-lg font-semibold text-indigo-700">{app.userCount || 0}</p>
                      <p className="text-xs text-gray-500 uppercase">Users</p>
                    </div>
                    
                    <div className="text-center px-4 py-2 bg-purple-50 rounded-lg">
                      <p className="text-lg font-semibold text-purple-700">${Number(app.revenue || 0).toFixed(2)}</p>
                      <p className="text-xs text-gray-500 uppercase">Revenue</p>
                    </div>
                  </div>
                  
                  <button 
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={expandedApp === app.id ? "Collapse details" : "Expand details"}
                  >
                    {expandedApp === app.id ? (
                      <IoArrowUp className="h-5 w-5" />
                    ) : (
                      <IoArrowDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions section always available but only shown based on expandedApp state */}
              <div className={`mt-6 pt-4 border-t border-gray-100 ${expandedApp !== app.id ? 'hidden md:block' : ''}`}>
                <div className="grid grid-cols-1 gap-6">
                  {renderAppActions(app)}
                </div>
              </div>

              {loading && expandedApp === app.id && (
                <div className="mt-6 py-2">
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
                <div className="mt-6 p-4 rounded-lg bg-red-50 text-red-600">
                  {detailError}
                </div>
              )}

              {expandedApp === app.id && !loading && !detailError && (
                <div className="mt-6 pt-4 border-t border-gray-100 md:hidden">
                  <div className="grid grid-cols-1 gap-6">
                    {renderAppActions(app)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicAppsList;