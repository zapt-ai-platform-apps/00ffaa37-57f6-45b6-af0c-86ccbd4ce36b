import React, { useState } from 'react';
import useAuth from '../auth/hooks/useAuth';

const AdminTools = () => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const runMigrations = async () => {
    if (!session) return;
    
    try {
      setIsLoading(true);
      setResult(null);
      
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run migrations');
      }
      
      setResult({
        success: true,
        message: data.message || 'Migrations completed successfully'
      });
      
    } catch (error) {
      console.error('Migration error:', error);
      setResult({
        success: false,
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Admin Tools</h2>
      
      <div className="mb-4">
        <button 
          onClick={runMigrations}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Running Migrations...' : 'Run Database Migrations'}
        </button>
      </div>
      
      {result && (
        <div className={`p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default AdminTools;