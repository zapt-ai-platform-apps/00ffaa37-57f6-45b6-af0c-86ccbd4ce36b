import { apps, actions } from '../drizzle/schema.js';
import { getDbClient, parseActions } from './_apiUtils.js';
import { eq, asc } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const db = getDbClient();
    
    // GET request to fetch a user's public dashboard data
    if (req.method === 'GET') {
      const { userId } = req.query;
      
      if (!userId) {
        console.log('Missing userId parameter in public-user API call');
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      console.log(`Fetching public dashboard for user: ${userId}`);
      
      try {
        // Get all public apps for this user
        // Removed 'strategy' field since it was dropped from the database in migration 0007
        const userApps = await db.select({
          id: apps.id,
          name: apps.name,
          description: apps.description,
          userCount: apps.userCount,
          revenue: apps.revenue,
          createdAt: apps.createdAt,
          domain: apps.domain
        }).from(apps)
          .where(eq(apps.userId, userId));
        
        // For each app, try to get actions from the actions table
        const appsWithActions = await Promise.all(userApps.map(async (app) => {
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
        
        // Calculate metrics
        const metrics = appsWithActions.reduce(
          (acc, app) => {
            acc.totalUsers += app.userCount || 0;
            acc.totalRevenue += Number(app.revenue) || 0;
            acc.completedActions += (app.actions || []).filter(a => a.completed).length;
            acc.totalActions += (app.actions || []).length;
            return acc;
          },
          { totalApps: appsWithActions.length, totalUsers: 0, totalRevenue: 0, completedActions: 0, totalActions: 0 }
        );
        
        return res.status(200).json({
          apps: appsWithActions,
          metrics
        });
      } catch (error) {
        console.error('Error fetching public user dashboard:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to load dashboard. Please try again.' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in public user endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}