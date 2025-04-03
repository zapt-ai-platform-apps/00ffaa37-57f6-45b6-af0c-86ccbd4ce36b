import { initializeZapt } from '@zapt/zapt-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { apps } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';

export default async function handler(req, res) {
  console.log('API: apps endpoint called');
  
  try {
    const user = await authenticateUser(req);
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    if (req.method === 'GET') {
      console.log('GET request to fetch user apps');
      
      const userApps = await db.select().from(apps).where((app) => {
        return app.userId.equals(user.id);
      });
      
      res.status(200).json(userApps);
    } else if (req.method === 'POST') {
      console.log('POST request to create a new app');
      
      const { name, description, domain } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      
      const newApp = {
        name,
        description,
        domain: domain || null,
        userId: user.id,
        isPublic: true // All apps are public by default now
      };
      
      const result = await db.insert(apps).values(newApp).returning();
      
      res.status(201).json(result[0]);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in apps API:', error);
    res.status(500).json({ error: error.message });
  }
}