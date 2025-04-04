import { initializeZapt } from '@zapt/zapt-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { apps, metricHistory } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { authenticateUser } from './_apiUtils.js';
import Sentry from './_sentry.js';

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
      
      // Extract safe fields for update, removing timestamps to avoid conversion issues
      const { createdAt, created_at, ...safeUpdateData } = req.body;
      
      // Always enforce isPublic as true
      const updatedApp = {
        ...safeUpdateData,
        isPublic: true
      };
      
      const result = await db.update(apps)
        .set(updatedApp)
        .where(eq(apps.id, id))
        .returning();
      
      // Record metric history if metrics have changed
      const currentApp = appData[0];
      try {
        // Convert values to numbers for reliable comparison
        const currentUserCount = Number(currentApp.userCount) || 0;
        const currentRevenue = Number(currentApp.revenue) || 0;
        const newUserCount = Number(safeUpdateData.userCount) || 0;
        const newRevenue = Number(safeUpdateData.revenue) || 0;

        console.log(`Current metrics - userCount: ${currentUserCount}, revenue: ${currentRevenue}`);
        console.log(`New metrics - userCount: ${newUserCount}, revenue: ${newRevenue}`);

        // Always record new metrics when they are provided in the update, regardless of change
        if ('userCount' in safeUpdateData) {
          console.log(`Recording user count history: ${newUserCount}`);
          await db.insert(metricHistory)
            .values({
              appId: id,
              metricType: 'user_count',
              value: newUserCount
            });
        }
        
        if ('revenue' in safeUpdateData) {
          console.log(`Recording revenue history: ${newRevenue}`);
          await db.insert(metricHistory)
            .values({
              appId: id,
              metricType: 'revenue',
              value: newRevenue
            });
        }
      } catch (historyError) {
        // Log the error but don't fail the update
        console.error('Error recording metric history:', historyError);
        Sentry.captureException(historyError);
      }
      
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
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
  }
}