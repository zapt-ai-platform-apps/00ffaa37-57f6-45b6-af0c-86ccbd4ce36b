import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

// Get all apps for the authenticated user
export async function getApps() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch('/api/apps', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch apps');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting apps:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Get a single app by ID
export async function getApp(id) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`/api/app?id=${id}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch app');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting app:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Create a new app
export async function createApp(appData) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch('/api/apps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(appData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create app');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating app:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Update an app
export async function updateApp(id, appData) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`/api/app?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(appData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update app');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating app:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Delete an app
export async function deleteApp(id) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`/api/app?id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete app');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting app:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Add a new action
export async function addAction(appId, text) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch('/api/actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ appId, text })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add action');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding action:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Update an action
export async function updateAction(id, appId, updates) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch('/api/actions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ id, appId, ...updates })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update action');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating action:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Delete an action
export async function deleteAction(id, appId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`/api/actions?id=${id}&appId=${appId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete action');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting action:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Get all public apps
export async function getPublicApps() {
  try {
    const response = await fetch('/api/public-apps');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch public apps');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting public apps:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Get public dashboard for a user
export async function getUserPublicDashboard(userId) {
  try {
    const response = await fetch(`/api/public-user?userId=${userId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch public dashboard');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting public dashboard:', error);
    Sentry.captureException(error);
    throw error;
  }
}