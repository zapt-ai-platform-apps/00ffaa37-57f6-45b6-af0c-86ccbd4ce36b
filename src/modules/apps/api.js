import * as Sentry from '@sentry/browser';
import { supabase } from '@/supabaseClient';

// Helper function to get auth token
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

// Function to handle API errors
function handleApiError(error, operation) {
  console.error(`Error during ${operation}:`, error);
  Sentry.captureException(error);
  throw error;
}

export const getApps = async () => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch('/api/apps', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch apps');
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetching apps');
  }
};

export const getAppById = async (id) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`/api/app?id=${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch app');
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetching app');
  }
};

export const createApp = async (appData) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch('/api/apps', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create app');
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'creating app');
  }
};

export const updateApp = async (id, appData) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`/api/app?id=${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update app');
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'updating app');
  }
};

export const deleteApp = async (id) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`/api/app?id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete app');
    }
    
    return true;
  } catch (error) {
    return handleApiError(error, 'deleting app');
  }
};