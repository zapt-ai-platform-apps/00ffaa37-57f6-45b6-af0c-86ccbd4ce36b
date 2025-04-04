import React, { useState } from 'react';

export default function ActionContext({ app, onUpdateContext, isLoading }) {
  const [context, setContext] = useState(app?.context || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateContext(context);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Additional Context for AI</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            {app?.context ? 'Edit' : 'Add Context'}
          </button>
        </div>
        
        {app?.context ? (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-800 whitespace-pre-wrap">{app.context}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Add extra information about your app that will help the AI generate better growth actions.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-medium mb-3">Additional Context for AI</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
            Extra Information for Action Generation
          </label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="input box-border border-gray-300"
            rows="5"
            placeholder="Examples: target audience, specific challenges, marketing channels, etc."
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">
            This information will be used by the AI when generating startup actions for your app.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn-secondary cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Context'}
          </button>
        </div>
      </form>
    </div>
  );
}