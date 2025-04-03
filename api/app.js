import { initializeZapt } from '@zapt/zapt-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { apps } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { authenticateUser } from './_apiUtils.js';

export default async function handler(req, res) {
  console.log('API: app endpoint called');
  
  try {
    const user = await authenticateUser(req);
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Extract app ID from query
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'App ID is required' });
    }
    
    if (req.method === 'GET') {
      console.log(`GET request to fetch app with ID: ${id}`);
      
      const appData = await db.select().from(apps).where(eq(apps.id, id));
      
      if (appData.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      // Check if user is authorized to access this app
      if (appData[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      res.status(200).json(appData[0]);
    } else if (req.method === 'PUT') {
      console.log(`PUT request to update app with ID: ${id}`);
      
      // Get the app to make sure it belongs to the user
      const appData = await db.select().from(apps).where(eq(apps.id, id));
      
      if (appData.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      // Check if user is authorized to update this app
      if (appData[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      // Always enforce isPublic as true
      const updatedApp = {
        ...req.body,
        isPublic: true
      };
      
      const result = await db.update(apps)
        .set(updatedApp)
        .where(eq(apps.id, id))
        .returning();
      
      res.status(200).json(result[0]);
    } else if (req.method === 'DELETE') {
      console.log(`DELETE request to remove app with ID: ${id}`);
      
      // Get the app to make sure it belongs to the user
      const appData = await db.select().from(apps).where(eq(apps.id, id));
      
      if (appData.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      // Check if user is authorized to delete this app
      if (appData[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      await db.delete(apps).where(eq(apps.id, id));
      
      res.status(200).json({ message: 'App deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in app API:', error);
    res.status(500).json({ error: error.message });
  }
}