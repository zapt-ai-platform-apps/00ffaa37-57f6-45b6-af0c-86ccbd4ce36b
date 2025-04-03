import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function AppList({ apps, loading, onRefresh }) {
  if (loading && apps.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading apps...</p>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-500 mb-4">No apps added yet. Get started by adding your first app!</p>
        <button onClick={onRefresh} className="btn-secondary">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <Link 
          to={`/apps/${app.id}`}
          key={app.id}
          className="card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{app.name}</h3>
            <span className="badge bg-indigo-100 text-indigo-800">
              {app.status || 'Active'}
            </span>
          </div>
          
          <p className="text-gray-600 mt-1 line-clamp-2">{app.description}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Users</p>
              <p className="text-lg font-medium">{app.userCount || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="text-lg font-medium">${app.revenue || 0}</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div>
              <span className="text-xs">
                Created: {format(new Date(app.createdAt || new Date()), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs mr-1">Actions:</span>
              <span className="text-xs text-green-600 font-medium">
                {(app.actions || []).filter(a => a.completed).length} done
              </span>
              {" / "}
              <span className="text-xs">
                {(app.actions || []).length} total
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}