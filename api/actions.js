import { initializeZapt } from '@zapt/zapt-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { apps, actions } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('API: actions endpoint called');
  
  try {
    const user = await authenticateUser(req);
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    if (req.method === 'POST') {
      console.log('POST request to create a new action');
      
      const { appId, text } = req.body;
      
      if (!appId || !text) {
        return res.status(400).json({ error: 'App ID and text are required' });
      }
      
      // Check if user owns the app
      const app = await db.select().from(apps).where(eq(apps.id, appId));
      
      if (app.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      if (app[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      const newAction = {
        appId,
        text,
        completed: false,
        createdAt: new Date()
      };
      
      const result = await db.insert(actions).values(newAction).returning();
      
      res.status(201).json(result[0]);
    } else if (req.method === 'PUT') {
      console.log('PUT request to update an action');
      
      const { id, appId, text, completed } = req.body;
      
      if (!id || !appId) {
        return res.status(400).json({ error: 'Action ID and App ID are required' });
      }
      
      // Check if user owns the app
      const app = await db.select().from(apps).where(eq(apps.id, appId));
      
      if (app.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      if (app[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      // Check if action exists for this app
      const action = await db.select()
        .from(actions)
        .where(and(eq(actions.id, id), eq(actions.appId, appId)));
      
      if (action.length === 0) {
        return res.status(404).json({ error: 'Action not found' });
      }
      
      const updateData = {};
      
      if (text !== undefined) {
        updateData.text = text;
      }
      
      if (completed !== undefined) {
        updateData.completed = completed;
        updateData.completedAt = completed ? new Date() : null;
      }
      
      const result = await db.update(actions)
        .set(updateData)
        .where(and(eq(actions.id, id), eq(actions.appId, appId)))
        .returning();
      
      res.status(200).json(result[0]);
    } else if (req.method === 'DELETE') {
      console.log('DELETE request to remove an action');
      
      const { id, appId } = req.query;
      
      if (!id || !appId) {
        return res.status(400).json({ error: 'Action ID and App ID are required' });
      }
      
      // Check if user owns the app
      const app = await db.select().from(apps).where(eq(apps.id, appId));
      
      if (app.length === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      if (app[0].userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to app' });
      }
      
      // Delete the action
      await db.delete(actions)
        .where(and(eq(actions.id, id), eq(actions.appId, appId)));
      
      res.status(200).json({ message: 'Action deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in actions API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
  }
}