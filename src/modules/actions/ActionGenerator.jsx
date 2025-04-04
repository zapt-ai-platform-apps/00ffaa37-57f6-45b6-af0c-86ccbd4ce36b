import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import { supabase } from '@/supabaseClient';
import { FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function ActionGenerator({ app, onAddAction, onCancel }) {
  const [generatedActions, setGeneratedActions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [selectedActionIndex, setSelectedActionIndex] = useState(null);
  const [showTractionTips, setShowTractionTips] = useState(false);

  const generateActions = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setSelectedActionIndex(null);
      
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      // Include app context in the request
      const requestData = {
        appName: app.name,
        appDescription: app.description,
        userCount: app.userCount,
        revenue: app.revenue,
        actions: app.actions
      };
      
      // Add context if it exists
      if (app.context && app.context.trim()) {
        requestData.context = app.context;
      }
      
      console.log('Generating traction-focused actions with context:', app.context ? 'Yes' : 'No');
      
      const response = await fetch('/api/generate-action', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate actions');
      }
      
      const data = await response.json();
      setGeneratedActions(data.actions || []);
      setIsGenerating(false);
      
    } catch (error) {
      console.error('Error generating actions:', error);
      Sentry.captureException(error);
      setError('Failed to generate actions. Please try again.');
      setIsGenerating(false);
    }
  };

  // Generate actions when the component mounts
  useEffect(() => {
    generateActions();
  }, []);

  const handleSelectAction = (index) => {
    setSelectedActionIndex(index);
  };

  const handleAddSelectedAction = async () => {
    if (selectedActionIndex === null || !generatedActions[selectedActionIndex]) return;
    
    setIsAdding(true);
    try {
      await onAddAction(generatedActions[selectedActionIndex]);
    } catch (error) {
      console.error('Error adding action:', error);
      Sentry.captureException(error);
      setError('Failed to add action. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTractionTips = () => {
    setShowTractionTips(!showTractionTips);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-medium mb-4">AI-Generated Traction Actions</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <button 
        onClick={toggleTractionTips}
        className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 flex items-center cursor-pointer"
      >
        <FiInfo className="w-4 h-4 mr-1" />
        <span>Traction strategy guide</span>
        {showTractionTips ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
      </button>
      
      {showTractionTips && (
        <div className="bg-indigo-50 p-4 rounded-md mb-4 text-sm">
          <h4 className="font-medium text-indigo-900 mb-2">How to get your first 100 users</h4>
          <p className="text-indigo-800 mb-3">Strategies that actually work, ranked from most to least effective:</p>
          
          <div className="space-y-3">
            <div className="border-l-2 border-indigo-400 pl-3">
              <p className="font-medium text-indigo-900">1. Email people you already know</p>
              <p className="text-indigo-700">Use your network - friends, classmates, ex-colleagues who could benefit. If you're charging, make them pay. Early customers should feel the value.</p>
            </div>
            
            <div className="border-l-2 border-indigo-400 pl-3">
              <p className="font-medium text-indigo-900">2. Targeted cold outreach</p>
              <p className="text-indigo-700">Do the research. Find the right people and send personal, direct messages. A good campaign converts 2-3%.</p>
            </div>
            
            <div className="border-l-2 border-indigo-400 pl-3">
              <p className="font-medium text-indigo-900">3. Social media and press</p>
              <p className="text-indigo-700">Can work, but only with consistency. One article won't carry you. Airbnb kept momentum by creating their own headlines.</p>
            </div>
            
            <div className="border-l-2 border-indigo-400 pl-3">
              <p className="font-medium text-indigo-900">4. Paid ads</p>
              <p className="text-indigo-700">Least effective for early traction. No breakout startup got its first users this way.</p>
            </div>
            
            <p className="text-indigo-900 font-medium mt-3 bg-indigo-100 p-2 rounded">The first 100 users don't come from scale. They come from direct effort, focus, and doing what doesn't scale.</p>
          </div>
        </div>
      )}
      
      {isGenerating ? (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Generating your next traction actions...</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Select one of these traction-building actions that you'd like to add to your growth plan:
            </p>
            <div className="space-y-3">
              {generatedActions.map((action, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-md border-2 cursor-pointer ${
                    selectedActionIndex === index 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectAction(index)}
                >
                  <p className="text-gray-800">{action}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={generateActions}
              className="btn-secondary cursor-pointer text-sm"
              disabled={isGenerating || isAdding}
            >
              Generate More
            </button>
            <button
              onClick={handleAddSelectedAction}
              className="btn-primary cursor-pointer text-sm"
              disabled={isGenerating || isAdding || selectedActionIndex === null}
            >
              {isAdding ? (
                <span className="flex items-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Adding...
                </span>
              ) : (
                'Add Selected Action'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}