import { apps, actions } from '../drizzle/schema.js';
import { getDbClient, parseActions } from './_apiUtils.js';
import { eq, asc } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const db = getDbClient();
    
    // GET request to fetch all public apps
    if (req.method === 'GET') {
      const { userId } = req.query;
      
      console.log('Fetching public apps' + (userId ? ` for user: ${userId}` : ''));
      
      try {
        let query = db.select({
          id: apps.id,
          name: apps.name,
          description: apps.description,
          userCount: apps.userCount,
          revenue: apps.revenue,
          createdAt: apps.createdAt,
          domain: apps.domain,
          strategy: apps.strategy,
          userId: apps.userId
        }).from(apps);
        
        // If userId is provided, fetch only that user's public apps
        if (userId) {
          query = query.where(eq(apps.userId, userId));
        } else {
          // Otherwise fetch all apps that are marked as public
          query = query.where(eq(apps.isPublic, true));
        }
        
        const appsList = await query;
        
        // For each app, try to get actions from the actions table
        const appsWithActions = await Promise.all(appsList.map(async (app) => {
          try {
            const appActions = await db.select({
              id: actions.id,
              text: actions.text,
              completed: actions.completed,
              createdAt: actions.createdAt,
              completedAt: actions.completedAt
            }).from(actions)
              .where(eq(actions.appId, app.id))
              .orderBy(asc(actions.createdAt));
            
            return {
              ...app,
              actions: appActions
            };
          } catch (actionsError) {
            console.error(`Error fetching actions for app ${app.id}, using JSON field:`, actionsError);
            
            // Fall back to getting actions from the app record
            const [fullApp] = await db.select().from(apps)
              .where(eq(apps.id, app.id))
              .limit(1);
            
            return {
              ...app,
              actions: parseActions(fullApp.actions)
            };
          }
        }));
        
        return res.status(200).json(appsWithActions);
      } catch (error) {
        console.error('Error fetching public apps:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to load apps. Please try again.' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in public apps endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}