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