import React, { useState } from 'react';
import StrategyGenerator from './StrategyGenerator';
import { updateApp } from '@/modules/apps/api';
import * as Sentry from '@sentry/browser';

export default function StrategySection({ app, onUpdateApp }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSetStrategy = async (strategy) => {
    try {
      setLoading(true);
      const updatedApp = await updateApp(app.id, {
        ...app,
        strategy
      });
      onUpdateApp(updatedApp);
      setIsGenerating(false);
      setError(null);
    } catch (err) {
      console.error('Error updating strategy:', err);
      Sentry.captureException(err);
      setError('Failed to update strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-8">
      <h2 className="text-xl font-semibold mb-4">Traction Strategy</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {app.strategy && !isGenerating ? (
        <div>
          <p className="text-gray-700 mb-4">{app.strategy}</p>
          <button
            onClick={() => setIsGenerating(true)}
            className="btn-secondary"
          >
            Generate New Strategy
          </button>
        </div>
      ) : (
        <StrategyGenerator 
          app={app}
          onSetStrategy={handleSetStrategy}
          onCancel={() => setIsGenerating(false)}
          isLoading={loading}
        />
      )}
    </div>
  );
}