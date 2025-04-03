import React, { useState } from 'react';
import * as Sentry from '@sentry/browser';
import { supabase } from '@/supabaseClient';

export default function StrategyGenerator({ app, onSetStrategy, onCancel, isLoading }) {
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);

  const generateStrategy = async () => {
    try {
      setIsThinking(true);
      setError(null);
      
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/generate-strategy', {
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
        throw new Error(errorData.error || 'Failed to generate strategy');
      }
      
      const data = await response.json();
      setGeneratedStrategy(data.strategy);
      
    } catch (error) {
      console.error('Error generating strategy:', error);
      Sentry.captureException(error);
      setError('Failed to generate strategy. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {!generatedStrategy && !isThinking ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-6">
            Generate a focused traction strategy for your app using our AI assistant powered by Claude.
          </p>
          <button
            onClick={generateStrategy}
            className="btn-primary cursor-pointer"
            disabled={isLoading}
          >
            Generate Strategy
          </button>
        </div>
      ) : isThinking ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your strategy with Claude AI...</p>
        </div>
      ) : (
        <div className="py-4">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-md mb-6">
            <p className="text-gray-800 whitespace-pre-line">{generatedStrategy}</p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="btn-secondary cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={() => onSetStrategy(generatedStrategy)}
              className="btn-primary flex items-center cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                'Use This Strategy'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}