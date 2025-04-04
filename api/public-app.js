import { apps, actions } from '../drizzle/schema.js';
import { getDbClient, parseActions } from './_apiUtils.js';
import { eq, asc } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const db = getDbClient();
    
    // GET request to fetch a specific public app
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'App ID is required' });
      }
      
      console.log(`Fetching public app: ${id}`);
      
      try {
        const [app] = await db.select({
          id: apps.id,
          name: apps.name,
          description: apps.description,
          userCount: apps.userCount,
          revenue: apps.revenue,
          createdAt: apps.createdAt,
          domain: apps.domain,
          actions: apps.actions // Include the JSON actions field
        }).from(apps)
          .where(eq(apps.id, id))
          .limit(1);
        
        if (!app) {
          return res.status(404).json({ error: 'App not found' });
        }
        
        // Get actions for this app from the actions table
        let appActions = [];
        try {
          appActions = await db.select({
            id: actions.id,
            text: actions.text,
            completed: actions.completed,
            createdAt: actions.createdAt,
            completedAt: actions.completedAt
          }).from(actions)
            .where(eq(actions.appId, id))
            .orderBy(asc(actions.createdAt));
          
          console.log(`Found ${appActions.length} actions in actions table for app ${id}`);
        } catch (actionsError) {
          console.error('Error fetching from actions table, will try JSON field:', actionsError);
          
          // Fall back to getting actions from the app record
          appActions = parseActions(app.actions);
          console.log(`Parsed ${appActions.length} actions from JSON field for app ${id}`);
        }
        
        // If no actions were found in either place, try to ensure we don't have an empty array
        if (!appActions || appActions.length === 0) {
          console.log(`No actions found for app ${id}, checking JSON field explicitly`);
          // Make a direct attempt to parse the actions JSON
          appActions = parseActions(app.actions);
        }
        
        return res.status(200).json({
          ...app,
          actions: appActions || [] // Ensure actions is always at least an empty array
        });
      } catch (error) {
        console.error('Error fetching public app:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to load app details. Please try again.' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in public app endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}