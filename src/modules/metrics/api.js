import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

export async function getMetricHistory(appId, metricType, limit = 30) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`/api/metric-history?appId=${appId}&metricType=${metricType}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch ${metricType} history`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error getting ${metricType} history:`, error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function recordMetricHistory(appId, metricType, value) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch('/api/metric-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        appId,
        metricType,
        value
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to record ${metricType}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error recording ${metricType}:`, error);
    Sentry.captureException(error);
    throw error;
  }
}