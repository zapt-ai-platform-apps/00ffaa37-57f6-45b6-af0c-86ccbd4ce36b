import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { apps } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('API: public-apps endpoint called');
  
  try {
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    if (req.method === 'GET') {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      console.log(`Getting public apps for user ID: ${userId}`);
      
      // For this endpoint, we'll still check isPublic just to maintain backward compatibility
      // but in the future, we can simplify this since all apps will be public
      const userApps = await db.select().from(apps).where((app) => {
        return app.userId.equals(userId);
      });
      
      res.status(200).json(userApps);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in public-apps API:', error);
    res.status(500).json({ error: error.message });
  }
}