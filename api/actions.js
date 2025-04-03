import { initializeZapt } from '@zapt/zapt-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { actions, apps } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import { authenticateUser, cleanObjectForUpdate } from './_apiUtils.js';

export default async function handler(req, res) {
  console.log('API: actions endpoint called');
  
  try {
    const user = await authenticateUser(req);
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    if (req.method === 'POST') {
      console.log('POST request to create action');
      
      const { appId, text } = req.body;
      
      if (!appId || !text) {
        return res.status(400).json({ error: 'App ID and text are required' });
      }
      
      // Verify user owns the app
      const appData = await db.select().from(apps).where(eq(apps.id, appId));
      
      if (appData.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      if (appData[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      // Create new action
      const result = await db.insert(actions)
        .values({
          appId,
          text,
          completed: false
        })
        .returning();
      
      res.status(201).json(result[0]);
    } else if (req.method === 'PUT') {
      console.log('PUT request to update action');
      
      const { id, appId, ...updateData } = req.body;
      
      if (!id || !appId) {
        return res.status(400).json({ error: 'Action ID and App ID are required' });
      }
      
      // Verify user owns the app
      const appData = await db.select().from(apps).where(eq(apps.id, appId));
      
      if (appData.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      if (appData[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      // Ensure we clean any timestamp fields to prevent conversion issues
      const safeUpdateData = cleanObjectForUpdate(updateData);
      
      // Special handling for 'completed' field - if being marked as completed, set completedAt
      if (safeUpdateData.completed === true) {
        safeUpdateData.completedAt = new Date();
      } else if (safeUpdateData.completed === false) {
        safeUpdateData.completedAt = null;
      }
      
      // Update action
      const result = await db.update(actions)
        .set(safeUpdateData)
        .where(and(eq(actions.id, id), eq(actions.appId, appId)))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Action not found' });
      }
      
      res.status(200).json(result[0]);
    } else if (req.method === 'DELETE') {
      console.log('DELETE request to remove action');
      
      const { id, appId } = req.query;
      
      if (!id || !appId) {
        return res.status(400).json({ error: 'Action ID and App ID are required' });
      }
      
      // Verify user owns the app
      const appData = await db.select().from(apps).where(eq(apps.id, appId));
      
      if (appData.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      if (appData[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      // Delete action
      const result = await db.delete(actions)
        .where(and(eq(actions.id, id), eq(actions.appId, appId)))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Action not found' });
      }
      
      res.status(200).json({ message: 'Action deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in actions API:', error);
    res.status(500).json({ error: error.message });
  }
}