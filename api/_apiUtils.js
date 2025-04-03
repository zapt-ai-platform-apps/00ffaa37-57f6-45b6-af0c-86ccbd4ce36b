import { initializeZapt } from '@zapt/zapt-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

const { supabase } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

export async function authenticateUser(req, requireAuth = true) {
  const authHeader = req.headers.authorization;
  
  // If authentication is not required or we're handling public access
  if (!requireAuth) {
    return null;
  }
  
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    throw new Error('Invalid token');
  }

  return user;
}

export function getDbClient() {
  try {
    if (!process.env.COCKROACH_DB_URL) {
      throw new Error('COCKROACH_DB_URL environment variable is not defined');
    }
    
    console.log('Connecting to database...');
    const client = postgres(process.env.COCKROACH_DB_URL);
    return drizzle(client);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    Sentry.captureException(error);
    throw new Error('Database connection failed: ' + error.message);
  }
}

// Parse actions from various formats
export function parseActions(actionsData) {
  if (!actionsData) return [];
  
  // If already an array object, return it
  if (Array.isArray(actionsData)) {
    return actionsData;
  }
  
  // If a string that looks like JSON, try to parse it
  if (typeof actionsData === 'string') {
    try {
      // Check if string starts with [ which would indicate JSON array
      if (actionsData.trim().startsWith('[')) {
        return JSON.parse(actionsData);
      } else {
        // Split by comma for CSV-style strings
        return actionsData.split(',').map(item => ({
          text: item.trim(),
          completed: false
        }));
      }
    } catch (error) {
      console.error('Error parsing actions string:', error);
      // Split by comma as fallback
      return actionsData.split(',').map(item => ({
        text: item.trim(),
        completed: false
      }));
    }
  }
  
  console.error('Unexpected actions format:', actionsData);
  return [];
}

// Safely access nested properties
export function safeGet(obj, path, defaultValue = null) {
  if (!obj) return defaultValue;
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current === undefined ? defaultValue : current;
}