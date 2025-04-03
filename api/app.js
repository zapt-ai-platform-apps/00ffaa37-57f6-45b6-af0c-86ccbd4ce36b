import { apps } from '../drizzle/schema.js';
import { authenticateUser, getDbClient, verifyAppsTable } from './_apiUtils.js';
import { eq, and } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const db = getDbClient();
    
    // Verify apps table exists
    const tableExists = await verifyAppsTable(db);
    if (!tableExists) {
      return res.status(500).json({ 
        error: 'Database table "apps" does not exist. Please run migrations first.'
      });
    }
    
    // Extract app ID from the query parameters
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'App ID is required' });
    }
    
    console.log(`Processing ${req.method} request for app ${id}`);

    // GET request to fetch a specific app
    if (req.method === 'GET') {
      const [app] = await db.select().from(apps)
        .where(and(eq(apps.id, id), eq(apps.userId, user.id)))
        .limit(1);
      
      if (!app) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      return res.status(200).json(app);
    }

    // PUT request to update an app
    if (req.method === 'PUT') {
      const appData = req.body;
      console.log('Updating app data:', appData);
      
      const [updatedApp] = await db.update(apps)
        .set({
          name: appData.name,
          description: appData.description,
          userCount: appData.userCount,
          revenue: appData.revenue,
          strategy: appData.strategy,
          actions: appData.actions,
          domain: appData.domain,
          isPublic: appData.isPublic !== undefined ? appData.isPublic : false
        })
        .where(and(eq(apps.id, id), eq(apps.userId, user.id)))
        .returning();
      
      if (!updatedApp) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      return res.status(200).json(updatedApp);
    }

    // DELETE request to delete an app
    if (req.method === 'DELETE') {
      const result = await db.delete(apps)
        .where(and(eq(apps.id, id), eq(apps.userId, user.id)))
        .returning({ id: apps.id });
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in app detail endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}