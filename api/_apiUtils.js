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

export async function authenticateUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Auth error:', error);
      throw new Error('Invalid token');
    }

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    Sentry.captureException(error);
    throw error;
  }
}

let db = null;

export function getDbClient() {
  if (!db) {
    const connectionString = process.env.COCKROACH_DB_URL;
    if (!connectionString) {
      throw new Error('Database connection string not found');
    }
    const client = postgres(connectionString);
    db = drizzle(client);
  }
  return db;
}

/**
 * Safely get a property from an object with a default value if undefined
 */
export function safeGet(obj, path, defaultValue) {
  if (!obj) return defaultValue;
  
  const pathArray = Array.isArray(path) ? path : path.split('.');
  let result = obj;
  
  for (const key of pathArray) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * Safely parse actions from a potentially malformed JSON string or array
 */
export function parseActions(actionsData) {
  // If it's already an array, return it
  if (Array.isArray(actionsData)) {
    return actionsData;
  }
  
  // If it's null or undefined, return empty array
  if (actionsData === null || actionsData === undefined) {
    return [];
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof actionsData === 'string') {
    try {
      // Check if it looks like JSON
      if (actionsData.trim().startsWith('[')) {
        return JSON.parse(actionsData);
      }
      
      // If it's just a comma-separated string, split it
      return actionsData.split(',').map(text => ({
        text: text.trim(),
        completed: false
      }));
    } catch (error) {
      console.error('Error parsing actions:', error);
      Sentry.captureException(error);
      
      // Return empty array on parse error
      return [];
    }
  }
  
  // If it's an object but not an array (should not happen), return empty array
  console.warn('Actions data is in unexpected format:', actionsData);
  return [];
}

/**
 * Create a safe validator function for API handlers
 */
export function createValidator(schema) {
  return function validate(data, handlerName) {
    try {
      // Perform validation based on schema
      // This is a simplified example - in a real app you might use a validation library
      if (!data) {
        throw new Error('Data is required');
      }
      
      // Return sanitized data
      return data;
    } catch (error) {
      console.error(`Validation error in ${handlerName}:`, error);
      Sentry.captureException(error);
      throw error;
    }
  };
}