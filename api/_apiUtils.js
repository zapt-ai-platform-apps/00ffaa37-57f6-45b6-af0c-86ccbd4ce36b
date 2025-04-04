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
  console.log('Parsing actions data type:', typeof actionsData);
  
  // If it's already an array, return it
  if (Array.isArray(actionsData)) {
    console.log('Actions is already an array with length:', actionsData.length);
    return actionsData;
  }
  
  // If it's null or undefined, return empty array
  if (actionsData === null || actionsData === undefined) {
    console.log('Actions data is null or undefined, returning empty array');
    return [];
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof actionsData === 'string') {
    try {
      // Check if it looks like JSON
      if (actionsData.trim().startsWith('[')) {
        const parsed = JSON.parse(actionsData);
        console.log('Successfully parsed JSON string into array with length:', parsed.length);
        return parsed;
      }
      
      // If it's just a comma-separated string, split it
      const items = actionsData.split(',').map(text => ({
        text: text.trim(),
        completed: false
      }));
      console.log('Parsed comma-separated string into array with length:', items.length);
      return items;
    } catch (error) {
      console.error('Error parsing actions:', error);
      Sentry.captureException(error);
      
      // Return empty array on parse error
      return [];
    }
  }
  
  // If it's an object (like JSONB from PostgreSQL)
  if (typeof actionsData === 'object') {
    console.log('Actions data is an object (not array)');
    // Try to handle it as best we can
    try {
      // Maybe it's stringified JSON that was parsed by the database driver
      const jsonStr = JSON.stringify(actionsData);
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        console.log('Converted object to array with length:', parsed.length);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to convert object to actions array:', e);
    }
  }
  
  // If we get here, we couldn't parse it properly
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

/**
 * Safely clean object data for database updates by removing timestamp fields
 * that could cause conversion issues
 */
export function cleanObjectForUpdate(data) {
  if (!data) return {};
  
  const safeData = { ...data };
  
  // Remove timestamp fields that shouldn't be updated or could cause conversion issues
  const fieldsToRemove = [
    'createdAt', 'created_at', 'updatedAt', 'updated_at', 
    'deletedAt', 'deleted_at', 'completedAt', 'completed_at'
  ];
  
  for (const field of fieldsToRemove) {
    if (field in safeData) {
      delete safeData[field];
    }
  }
  
  return safeData;
}