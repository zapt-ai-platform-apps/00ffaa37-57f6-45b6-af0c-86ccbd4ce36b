import { apps, actions } from '../drizzle/schema.js';
import { authenticateUser, getDbClient, parseActions } from './_apiUtils.js';
import { eq, asc } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const db = getDbClient();

    // GET request to fetch all apps
    if (req.method === 'GET') {
      console.log('Fetching apps for user:', user.id);
      
      try {
        const appsList = await db.select().from(apps).where(eq(apps.userId, user.id));
        
        // For each app, try to get actions from the actions table
        const appsWithActions = await Promise.all(appsList.map(async (app) => {
          try {
            const appActions = await db.select().from(actions)
              .where(eq(actions.appId, app.id))
              .orderBy(asc(actions.createdAt));
            
            return {
              ...app,
              actions: appActions
            };
          } catch (actionsError) {
            console.error(`Error fetching actions for app ${app.id}, using JSON field:`, actionsError);
            return {
              ...app,
              actions: parseActions(app.actions)
            };
          }
        }));
        
        return res.status(200).json(appsWithActions);
      } catch (error) {
        console.error('Error fetching apps:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to load apps. Please try again.' });
      }
    }

    // POST request to create a new app
    if (req.method === 'POST') {
      const appData = req.body;
      console.log('Creating new app:', appData);
      
      try {
        // First create the app
        const [newApp] = await db.insert(apps).values({
          name: appData.name,
          description: appData.description,
          userCount: appData.userCount || 0,
          revenue: appData.revenue || 0,
          userId: user.id,
          strategy: appData.strategy || null,
          domain: appData.domain || null,
          isPublic: appData.isPublic || false
        }).returning();
        
        // If there are actions, add them to the actions table
        const actionsData = appData.actions || [];
        if (Array.isArray(actionsData) && actionsData.length > 0) {
          try {
            const actionsToInsert = actionsData.map(action => ({
              appId: newApp.id,
              text: action.text,
              completed: action.completed || false,
              completedAt: action.completed ? new Date() : null
            }));
            
            await db.insert(actions).values(actionsToInsert);
            console.log(`Added ${actionsToInsert.length} actions to dedicated table`);
          } catch (actionsError) {
            console.error('Error adding actions to dedicated table, using JSON field:', actionsError);
            Sentry.captureException(actionsError);
            
            // Store actions as JSON in the app record as fallback
            await db.update(apps)
              .set({ actions: actionsData })
              .where(eq(apps.id, newApp.id));
          }
        }
        
        // Get the final app with actions
        const [finalApp] = await db.select().from(apps)
          .where(eq(apps.id, newApp.id));
        
        let finalActions = [];
        try {
          finalActions = await db.select().from(actions)
            .where(eq(actions.appId, newApp.id))
            .orderBy(asc(actions.createdAt));
        } catch (actionsError) {
          console.error('Error fetching actions for response:', actionsError);
          finalActions = parseActions(finalApp.actions);
        }
        
        return res.status(201).json({
          ...finalApp,
          actions: finalActions
        });
      } catch (error) {
        console.error('Error creating app:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to create app. Please try again.' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in apps endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}