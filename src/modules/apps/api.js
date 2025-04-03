import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

// Get all apps for the authenticated user
export async function getApps() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Ensure actions is parsed for each app
    return data.map(app => {
      if (app.actions && typeof app.actions === 'string') {
        try {
          app.actions = JSON.parse(app.actions);
        } catch (error) {
          console.error('Error parsing actions:', error);
          app.actions = [];
        }
      }
      return app;
    });
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

    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;

    // Ensure actions is parsed
    if (data.actions && typeof data.actions === 'string') {
      try {
        data.actions = JSON.parse(data.actions);
      } catch (error) {
        console.error('Error parsing actions:', error);
        data.actions = [];
      }
    }

    return data;
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

    const { data, error } = await supabase
      .from('apps')
      .insert([
        {
          ...appData,
          user_id: session.user.id,
          actions: []
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
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

    // Ensure we're not trying to update the user_id
    const { user_id, ...safeData } = appData;

    const { data, error } = await supabase
      .from('apps')
      .update(safeData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select();

    if (error) throw error;
    return data[0];
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

    const { error } = await supabase
      .from('apps')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting app:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Update the actions list for an app
export async function updateActions(id, actions) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('apps')
      .update({ actions })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating actions:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Update the metrics for an app
export async function updateMetrics(id, { userCount, revenue }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('apps')
      .update({ 
        user_count: userCount, 
        revenue 
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating metrics:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Get all public apps
export async function getPublicApps() {
  try {
    const { data, error } = await fetch('/api/public-apps').then(res => res.json());
    if (error) throw new Error(error);
    return data || [];
  } catch (error) {
    console.error('Error getting public apps:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Get public dashboard for a user
export async function getUserPublicDashboard(userId) {
  try {
    const { data, error } = await fetch(`/api/public-user?userId=${userId}`).then(res => res.json());
    if (error) throw new Error(error);
    return data || { apps: [], metrics: {} };
  } catch (error) {
    console.error('Error getting public dashboard:', error);
    Sentry.captureException(error);
    throw error;
  }
}

// Update public status of an app
export async function updatePublicStatus(id, isPublic) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('apps')
      .update({ is_public: isPublic })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating public status:', error);
    Sentry.captureException(error);
    throw error;
  }
}