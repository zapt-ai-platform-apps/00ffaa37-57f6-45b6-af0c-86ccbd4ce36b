import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { apps } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('API: public-apps endpoint called');
  
  try {
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    if (req.method === 'GET') {
      const { userId } = req.query;
      
      console.log(`Getting public apps ${userId ? `for user ID: ${userId}` : 'for all users'}`);
      
      // Modified logic to handle both cases - with and without userId
      let userApps;
      
      if (userId) {
        // Get apps for specific user
        userApps = await db.select().from(apps).where(eq(apps.userId, userId));
      } else {
        // Get all public apps when no userId is provided
        userApps = await db.select().from(apps);
      }
      
      console.log(`Retrieved ${userApps.length} public apps`);
      res.status(200).json(userApps);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in public-apps API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
  }
}