import React, { useState } from 'react';
import ActionItem from './ActionItem';
import ActionForm from './ActionForm';
import ActionGenerator from './ActionGenerator';
import { updateApp } from '@/modules/apps/api';
import * as Sentry from '@sentry/browser';

export default function ActionsSection({ app, onUpdateApp }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [isGeneratingAction, setIsGeneratingAction] = useState(false);

  const handleToggleAction = async (actionId) => {
    try {
      setLoading(true);
      
      // Find and toggle the action's completed status
      const updatedActions = app.actions.map(action => 
        action.id === actionId 
          ? { ...action, completed: !action.completed }
          : action
      );
      
      const updatedApp = await updateApp(app.id, {
        ...app,
        actions: updatedActions
      });
      
      onUpdateApp(updatedApp);
      setError(null);
    } catch (err) {
      console.error('Error updating action:', err);
      Sentry.captureException(err);
      setError('Failed to update action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAction = async (actionText) => {
    try {
      setLoading(true);
      
      // Create new action and add it to the list
      const newAction = {
        id: Date.now().toString(),
        text: actionText,
        completed: false
      };
      
      const updatedActions = [...(app.actions || []), newAction];
      
      const updatedApp = await updateApp(app.id, {
        ...app,
        actions: updatedActions
      });
      
      onUpdateApp(updatedApp);
      setIsAddingAction(false);
      setIsGeneratingAction(false);
      setError(null);
    } catch (err) {
      console.error('Error adding action:', err);
      Sentry.captureException(err);
      setError('Failed to add action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAction = async (actionId) => {
    try {
      setLoading(true);
      
      // Filter out the action to delete
      const updatedActions = app.actions.filter(action => action.id !== actionId);
      
      const updatedApp = await updateApp(app.id, {
        ...app,
        actions: updatedActions
      });
      
      onUpdateApp(updatedApp);
      setError(null);
    } catch (err) {
      console.error('Error deleting action:', err);
      Sentry.captureException(err);
      setError('Failed to delete action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Action Plan</h2>
        {!isAddingAction && !isGeneratingAction && (
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsGeneratingAction(true)}
              className="btn-primary text-sm"
            >
              Generate Next Action
            </button>
            <button 
              onClick={() => setIsAddingAction(true)}
              className="btn-secondary text-sm"
            >
              Add Custom Action
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {isAddingAction && (
        <div className="mb-6">
          <ActionForm 
            onSubmit={handleAddAction}
            onCancel={() => setIsAddingAction(false)}
            isLoading={loading}
          />
        </div>
      )}

      {isGeneratingAction && (
        <div className="mb-6">
          <ActionGenerator
            app={app}
            onAddAction={handleAddAction}
            onCancel={() => setIsGeneratingAction(false)}
          />
        </div>
      )}
      
      {(!app.actions || app.actions.length === 0) && !isAddingAction && !isGeneratingAction ? (
        <div className="py-8 text-center text-gray-500">
          <p>No actions added yet.</p>
          <p className="mt-2">Generate or add actions to track your traction building progress.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {app.actions && app.actions.map(action => (
            <ActionItem 
              key={action.id}
              action={action}
              onToggle={() => handleToggleAction(action.id)}
              onDelete={() => handleDeleteAction(action.id)}
              disabled={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}