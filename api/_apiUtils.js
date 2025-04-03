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
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    throw new Error('Invalid token');
  }

  // Only allow david@mapt.events to use the app
  if (user.email !== 'david@mapt.events') {
    throw new Error('Unauthorized user');
  }

  return user;
}

export function getDbClient() {
  const client = postgres(process.env.COCKROACH_DB_URL);
  return drizzle(client);
}