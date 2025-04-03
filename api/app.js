import { apps, actions } from '../drizzle/schema.js';
import { authenticateUser, getDbClient, parseActions, safeGet } from './_apiUtils.js';
import { eq, and, asc } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const db = getDbClient();
    
    // Extract app ID from the query parameters
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'App ID is required' });
    }
    
    console.log(`Processing ${req.method} request for app ${id}`);

    // GET request to fetch a specific app
    if (req.method === 'GET') {
      console.log('Fetching app with id:', id);
      
      try {
        // First check if the app exists and belongs to the user
        const [app] = await db.select().from(apps)
          .where(and(eq(apps.id, id), eq(apps.userId, user.id)))
          .limit(1);
        
        if (!app) {
          return res.status(404).json({ error: 'App not found' });
        }
        
        // Now try to get actions from the actions table
        let appActions = [];
        try {
          appActions = await db.select().from(actions)
            .where(eq(actions.appId, id))
            .orderBy(asc(actions.createdAt));
          
          console.log(`Found ${appActions.length} actions in the actions table`);
        } catch (actionsError) {
          console.error('Error fetching from actions table, will try legacy format:', actionsError);
          Sentry.captureException(actionsError);
          
          // If actions table doesn't exist or has an error, use the JSON from apps table
          appActions = parseActions(app.actions);
          console.log(`Using ${appActions.length} actions from JSON field`);
        }
        
        // Return the complete app data with actions
        return res.status(200).json({
          ...app,
          actions: appActions
        });
      } catch (error) {
        console.error('Error fetching app:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to fetch app details. Please try again.' });
      }
    }

    // PUT request to update an app
    if (req.method === 'PUT') {
      const appData = req.body;
      console.log('Updating app data:', appData);
      
      // Start a transaction to ensure all updates happen or none
      try {
        // First update the app details
        const [updatedApp] = await db.update(apps)
          .set({
            name: appData.name,
            description: appData.description,
            userCount: appData.userCount,
            revenue: appData.revenue,
            strategy: appData.strategy,
            domain: appData.domain,
            isPublic: appData.isPublic !== undefined ? appData.isPublic : false
          })
          .where(and(eq(apps.id, id), eq(apps.userId, user.id)))
          .returning();
        
        if (!updatedApp) {
          return res.status(404).json({ error: 'App not found' });
        }
        
        // Handle actions update if provided
        const actionsData = safeGet(appData, 'actions', []);
        if (Array.isArray(actionsData)) {
          try {
            // Try to update actions in the actions table
            // First delete existing actions
            await db.delete(actions)
              .where(eq(actions.appId, id));
            
            // Then insert the new ones
            if (actionsData.length > 0) {
              const actionsToInsert = actionsData.map(action => ({
                appId: id,
                text: action.text,
                completed: action.completed || false,
                completedAt: action.completed ? new Date() : null
              }));
              
              await db.insert(actions).values(actionsToInsert);
            }
            
            console.log(`Updated ${actionsData.length} actions in dedicated table`);
          } catch (actionsError) {
            console.error('Error updating actions in dedicated table, falling back to JSON:', actionsError);
            Sentry.captureException(actionsError);
            
            // If actions table operation fails, store as JSON in the app record
            await db.update(apps)
              .set({ actions: actionsData })
              .where(and(eq(apps.id, id), eq(apps.userId, user.id)));
            
            console.log('Updated actions in app JSON field');
          }
        }
        
        // Get the updated app with actions for the response
        const [finalApp] = await db.select().from(apps)
          .where(and(eq(apps.id, id), eq(apps.userId, user.id)))
          .limit(1);
        
        // Try to get actions from the actions table
        let finalActions = [];
        try {
          finalActions = await db.select().from(actions)
            .where(eq(actions.appId, id))
            .orderBy(asc(actions.createdAt));
        } catch (actionsError) {
          console.error('Error fetching from actions table for response:', actionsError);
          finalActions = parseActions(finalApp.actions);
        }
        
        return res.status(200).json({
          ...finalApp,
          actions: finalActions
        });
      } catch (error) {
        console.error('Error in app update transaction:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to update app. Please try again.' });
      }
    }

    // DELETE request to delete an app
    if (req.method === 'DELETE') {
      try {
        // Delete the app (actions will cascade due to FK constraint)
        const result = await db.delete(apps)
          .where(and(eq(apps.id, id), eq(apps.userId, user.id)))
          .returning({ id: apps.id });
        
        if (result.length === 0) {
          return res.status(404).json({ error: 'App not found' });
        }
        
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting app:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to delete app. Please try again.' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in app detail endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}