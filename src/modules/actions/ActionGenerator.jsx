import React, { useState } from 'react';
import * as Sentry from '@sentry/browser';
import { supabase } from '@/supabaseClient';

export default function ActionGenerator({ app, onAddAction, onCancel }) {
  const [generatedAction, setGeneratedAction] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const generateAction = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/generate-action', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appName: app.name,
          appDescription: app.description,
          userCount: app.userCount,
          revenue: app.revenue,
          actions: app.actions
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate action');
      }
      
      const data = await response.json();
      setGeneratedAction(data.action);
      setIsGenerating(false);
      
    } catch (error) {
      console.error('Error generating action:', error);
      Sentry.captureException(error);
      setError('Failed to generate action. Please try again.');
      setIsGenerating(false);
    }
  };

  // Generate an action when the component mounts
  React.useEffect(() => {
    generateAction();
  }, []);

  const handleAddAction = async () => {
    if (!generatedAction) return;
    
    setIsAdding(true);
    try {
      await onAddAction(generatedAction);
    } catch (error) {
      console.error('Error adding action:', error);
      Sentry.captureException(error);
      setError('Failed to add action. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {isGenerating ? (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Generating your next action...</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI-Generated Next Action:
            </label>
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-md">
              <p className="text-gray-800">{generatedAction}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={generateAction}
              className="btn-secondary cursor-pointer text-sm"
              disabled={isGenerating || isAdding}
            >
              Generate Again
            </button>
            <button
              onClick={handleAddAction}
              className="btn-primary cursor-pointer text-sm"
              disabled={isGenerating || isAdding}
            >
              {isAdding ? (
                <span className="flex items-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Adding...
                </span>
              ) : (
                'Add This Action'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}