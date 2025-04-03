import React, { useState } from 'react';
import ActionGenerator from './ActionGenerator';
import ActionForm from './ActionForm';
import ActionItem from './ActionItem';
import * as Sentry from '@sentry/browser';

export default function ActionsSection({ app, onUpdateStrategy, onUpdateActions, isLoading }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [error, setError] = useState(null);
  
  const { strategy, actions = [] } = app;
  
  const handleAddAction = (text) => {
    try {
      // Create a new action object
      const newAction = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      // Add it to the list of actions
      const updatedActions = [...actions, newAction];
      onUpdateActions(updatedActions);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding action:', err);
      Sentry.captureException(err);
      setError('Failed to add action. Please try again.');
    }
  };
  
  const handleToggleAction = (id) => {
    try {
      const updatedActions = actions.map(action => {
        if (action.id === id) {
          return {
            ...action,
            completed: !action.completed,
            completedAt: !action.completed ? new Date().toISOString() : null
          };
        }
        return action;
      });
      
      onUpdateActions(updatedActions);
    } catch (err) {
      console.error('Error toggling action:', err);
      Sentry.captureException(err);
      setError('Failed to update action. Please try again.');
    }
  };
  
  const handleDeleteAction = (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this action?')) {
        return;
      }
      
      const updatedActions = actions.filter(action => action.id !== id);
      onUpdateActions(updatedActions);
    } catch (err) {
      console.error('Error deleting action:', err);
      Sentry.captureException(err);
      setError('Failed to delete action. Please try again.');
    }
  };
  
  const handleEditAction = (id, text) => {
    try {
      const updatedActions = actions.map(action => {
        if (action.id === id) {
          return {
            ...action,
            text
          };
        }
        return action;
      });
      
      onUpdateActions(updatedActions);
    } catch (err) {
      console.error('Error editing action:', err);
      Sentry.captureException(err);
      setError('Failed to update action. Please try again.');
    }
  };
  
  const handleStrategyUpdated = (newStrategy) => {
    try {
      onUpdateStrategy(newStrategy);
      setShowGenerator(false);
    } catch (err) {
      console.error('Error updating strategy:', err);
      Sentry.captureException(err);
      setError('Failed to update strategy. Please try again.');
    }
  };
  
  const handleActionGenerated = (newAction) => {
    try {
      handleAddAction(newAction);
      setShowGenerator(false);
    } catch (err) {
      console.error('Error adding generated action:', err);
      Sentry.captureException(err);
      setError('Failed to add generated action. Please try again.');
    }
  };

  const pendingActions = actions.filter(a => !a.completed);
  const completedActions = actions.filter(a => a.completed);
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Growth Strategy & Actions</h2>
        <button 
          onClick={() => setShowGenerator(true)}
          className="btn-secondary cursor-pointer"
          disabled={isLoading}
        >
          Generate Strategy
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Strategy Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">7-Day Strategy</h3>
        </div>
        
        {strategy ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700 whitespace-pre-wrap">{strategy}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No strategy defined yet. Generate one to get started with focused growth actions.
          </p>
        )}
      </div>
      
      {/* Actions Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium">Growth Actions</h3>
          <div className="space-x-2">
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-secondary cursor-pointer"
              disabled={isLoading}
            >
              Add Action
            </button>
            <button 
              onClick={() => setShowGenerator(true)}
              className="btn-primary cursor-pointer"
              disabled={isLoading}
            >
              Generate Next Action
            </button>
          </div>
        </div>
        
        {showAddForm && (
          <div className="mb-4">
            <ActionForm 
              onSubmit={handleAddAction}
              onCancel={() => setShowAddForm(false)}
              isLoading={isLoading}
            />
          </div>
        )}

        {showGenerator && (
          <div className="mb-4">
            <ActionGenerator 
              app={app}
              onClose={() => setShowGenerator(false)}
              onStrategyGenerated={handleStrategyUpdated}
              onActionGenerated={handleActionGenerated}
            />
          </div>
        )}
        
        {actions.length === 0 ? (
          <p className="text-gray-500 italic mb-4">
            No actions added yet. Add your first action or generate one to get started.
          </p>
        ) : (
          <div>
            {/* Pending Actions */}
            {pendingActions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Pending Actions</h4>
                <div className="space-y-2">
                  {pendingActions.map(action => (
                    <ActionItem 
                      key={action.id}
                      action={action}
                      onToggle={handleToggleAction}
                      onDelete={handleDeleteAction}
                      onEdit={handleEditAction}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Completed Actions */}
            {completedActions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Completed Actions</h4>
                <div className="space-y-2">
                  {completedActions.map(action => (
                    <ActionItem 
                      key={action.id}
                      action={action}
                      onToggle={handleToggleAction}
                      onDelete={handleDeleteAction}
                      onEdit={handleEditAction}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}