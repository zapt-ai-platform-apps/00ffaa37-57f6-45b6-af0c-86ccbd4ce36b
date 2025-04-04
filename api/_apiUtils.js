import { initializeZapt } from '@zapt/zapt-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const { supabase } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

let dbClient = null;

export async function authenticateUser(req) {
  const authHeader = req.headers.authorization;
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
  if (!dbClient) {
    const client = postgres(process.env.COCKROACH_DB_URL);
    dbClient = drizzle(client);
  }
  return dbClient;
}

/**
 * Parse actions from various formats
 * @param {string|object} actionsData - The actions data to parse (could be JSON string, JSON object, or comma-separated string)
 * @returns {Array} - Array of action objects
 */
export function parseActions(actionsData) {
  // If no data, return empty array
  if (!actionsData) {
    console.log('No actions data provided to parseActions');
    return [];
  }
  
  try {
    // If already an array, return it
    if (Array.isArray(actionsData)) {
      console.log(`Actions data is already an array with ${actionsData.length} items`);
      return actionsData;
    }
    
    // If string, try to parse as JSON
    if (typeof actionsData === 'string') {
      console.log('Actions data is a string, attempting to parse');
      
      // Check if it looks like JSON (starts with [ or {)
      if (actionsData.trim().startsWith('[') || actionsData.trim().startsWith('{')) {
        const parsed = JSON.parse(actionsData);
        console.log(`Successfully parsed JSON string into array with ${Array.isArray(parsed) ? parsed.length : 1} items`);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      
      // If not JSON, try to parse as comma-separated values
      console.log('String does not appear to be JSON, parsing as comma-separated values');
      const actions = actionsData.split(',').map(item => ({
        text: item.trim(),
        completed: false,
        id: crypto.randomUUID ? crypto.randomUUID() : `fallback-${Date.now()}-${Math.random()}`
      }));
      console.log(`Parsed ${actions.length} items from comma-separated string`);
      return actions;
    }
    
    // If object (probably already parsed JSON), return as array
    if (typeof actionsData === 'object') {
      console.log('Actions data is an object, converting to array');
      return [actionsData];
    }
    
    // Default: return empty array
    console.log(`Unhandled actions data type: ${typeof actionsData}`);
    return [];
  } catch (error) {
    console.error('Error parsing actions:', error);
    console.error('Original actions data type:', typeof actionsData);
    console.error('Original actions data:', 
      typeof actionsData === 'string' ? 
        actionsData.substring(0, 100) + (actionsData.length > 100 ? '...' : '') : 
        actionsData);
    return [];
  }
}

/**
 * Clean object for update by removing timestamp fields
 * @param {object} obj - The object to clean
 * @returns {object} - Cleaned object ready for database update
 */
export function cleanObjectForUpdate(obj) {
  const cleaned = { ...obj };
  // Remove timestamp fields to prevent conversion issues
  const timestampFields = ['createdAt', 'created_at', 'updatedAt', 'updated_at'];
  timestampFields.forEach(field => {
    if (field in cleaned) {
      delete cleaned[field];
    }
  });
  return cleaned;
}