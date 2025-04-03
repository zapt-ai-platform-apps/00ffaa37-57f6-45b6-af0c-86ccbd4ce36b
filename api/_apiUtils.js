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
    const client = postgres(process.env.COCKROACH_DB_URL);
    return drizzle(client);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    Sentry.captureException(error);
    throw new Error('Database connection failed: ' + error.message);
  }
}

export async function verifyAppsTable(db) {
  try {
    const result = await db.execute(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'apps'
      );
    `);
    return result[0]?.exists || false;
  } catch (error) {
    console.error('Error verifying apps table:', error);
    Sentry.captureException(error);
    return false;
  }
}