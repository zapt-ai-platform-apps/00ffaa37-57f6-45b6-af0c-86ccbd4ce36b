import React from 'react';
import { format } from 'date-fns';

export default function PublicAppsList({ apps }) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">No apps have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold text-center mb-8">App Details & Progress</h2>
      
      {apps.map((app) => (
        <div key={app.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{app.name}</h3>
                <p className="text-gray-600 mt-1">{app.description}</p>
              </div>
              
              <div className="flex space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Users</p>
                  <p className="text-lg font-medium text-green-600">{app.userCount || 0}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-lg font-medium text-purple-600">${app.revenue || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Created: {format(new Date(app.createdAt || new Date()), 'MMMM d, yyyy')}
            </div>
          </div>
          
          {app.strategy && (
            <div className="p-6 border-b border-gray-200 bg-indigo-50">
              <h4 className="text-md font-semibold text-indigo-800 mb-2">Current Traction Strategy</h4>
              <p className="text-indigo-900">{app.strategy}</p>
            </div>
          )}
          
          <div className="p-6">
            <h4 className="text-md font-semibold mb-4">Action Plan Progress</h4>
            
            {(!app.actions || app.actions.length === 0) ? (
              <p className="text-gray-500 text-center py-4">No actions defined yet.</p>
            ) : (
              <div className="space-y-3">
                {app.actions.map((action) => (
                  <div 
                    key={action.id} 
                    className={`flex items-center p-3 rounded-md ${
                      action.completed ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full mr-3 ${
                      action.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {action.completed && (
                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className={`${action.completed ? 'text-green-800' : 'text-gray-700'}`}>
                      {action.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex-grow">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${app.actions && app.actions.length > 0 
                          ? Math.round((app.actions.filter(a => a.completed).length / app.actions.length) * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className="text-sm font-medium">
                    {app.actions && app.actions.length > 0 
                      ? Math.round((app.actions.filter(a => a.completed).length / app.actions.length) * 100) 
                      : 0}% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}