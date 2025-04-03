import React, { useState } from 'react';

export default function ActionForm({ onSubmit, onCancel, isLoading }) {
  const [actionText, setActionText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!actionText.trim()) {
      setError('Action text is required');
      return;
    }
    
    onSubmit(actionText);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="actionText" className="block text-sm font-medium text-gray-700 mb-1">
          Action Item
        </label>
        <input
          type="text"
          id="actionText"
          value={actionText}
          onChange={(e) => {
            setActionText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g., Create 3 blog posts about app features"
          className={`input w-full ${error ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Saving...
            </>
          ) : (
            'Add Action'
          )}
        </button>
      </div>
    </form>
  );
}