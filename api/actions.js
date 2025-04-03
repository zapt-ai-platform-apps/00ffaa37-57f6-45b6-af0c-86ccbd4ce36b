import { apps, actions } from '../drizzle/schema.js';
import { authenticateUser, getDbClient } from './_apiUtils.js';
import { eq, and } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const db = getDbClient();
    
    // POST request to add a new action to an app
    if (req.method === 'POST') {
      const { appId, text } = req.body;
      
      if (!appId || !text) {
        return res.status(400).json({ error: 'App ID and action text are required' });
      }
      
      console.log(`Adding new action to app ${appId}: ${text}`);
      
      try {
        // First check if the app exists and belongs to the user
        const [app] = await db.select().from(apps)
          .where(and(eq(apps.id, appId), eq(apps.userId, user.id)))
          .limit(1);
        
        if (!app) {
          return res.status(404).json({ error: 'App not found' });
        }
        
        // Try to add the action to the actions table
        try {
          const [newAction] = await db.insert(actions).values({
            appId,
            text,
            completed: false
          }).returning();
          
          return res.status(201).json(newAction);
        } catch (actionsError) {
          console.error('Error adding to actions table, using JSON field:', actionsError);
          Sentry.captureException(actionsError);
          
          // Fall back to updating the actions JSON in the app record
          let currentActions = [];
          if (app.actions) {
            if (Array.isArray(app.actions)) {
              currentActions = app.actions;
            } else if (typeof app.actions === 'string') {
              try {
                currentActions = JSON.parse(app.actions);
              } catch (parseError) {
                console.error('Error parsing actions:', parseError);
              }
            }
          }
          
          const newAction = {
            id: crypto.randomUUID(), // Generate a client-side UUID
            text,
            completed: false,
            createdAt: new Date().toISOString()
          };
          
          currentActions.push(newAction);
          
          await db.update(apps)
            .set({ actions: currentActions })
            .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));
          
          return res.status(201).json(newAction);
        }
      } catch (error) {
        console.error('Error adding action:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to add action. Please try again.' });
      }
    }
    
    // PUT request to update an action
    if (req.method === 'PUT') {
      const { id, appId, text, completed } = req.body;
      
      if (!id || !appId) {
        return res.status(400).json({ error: 'Action ID and App ID are required' });
      }
      
      console.log(`Updating action ${id} for app ${appId}`);
      
      try {
        // First check if the app exists and belongs to the user
        const [app] = await db.select().from(apps)
          .where(and(eq(apps.id, appId), eq(apps.userId, user.id)))
          .limit(1);
        
        if (!app) {
          return res.status(404).json({ error: 'App not found' });
        }
        
        // Try to update the action in the actions table
        try {
          const [updatedAction] = await db.update(actions)
            .set({
              text: text !== undefined ? text : undefined,
              completed: completed !== undefined ? completed : undefined,
              completedAt: completed ? new Date() : null
            })
            .where(eq(actions.id, id))
            .returning();
          
          if (!updatedAction) {
            return res.status(404).json({ error: 'Action not found' });
          }
          
          return res.status(200).json(updatedAction);
        } catch (actionsError) {
          console.error('Error updating in actions table, using JSON field:', actionsError);
          Sentry.captureException(actionsError);
          
          // Fall back to updating the actions JSON in the app record
          let currentActions = [];
          if (app.actions) {
            if (Array.isArray(app.actions)) {
              currentActions = app.actions;
            } else if (typeof app.actions === 'string') {
              try {
                currentActions = JSON.parse(app.actions);
              } catch (parseError) {
                console.error('Error parsing actions:', parseError);
              }
            }
          }
          
          const actionIndex = currentActions.findIndex(a => a.id === id);
          if (actionIndex === -1) {
            return res.status(404).json({ error: 'Action not found' });
          }
          
          const updatedAction = {
            ...currentActions[actionIndex],
            text: text !== undefined ? text : currentActions[actionIndex].text,
            completed: completed !== undefined ? completed : currentActions[actionIndex].completed,
            completedAt: completed ? new Date().toISOString() : null
          };
          
          currentActions[actionIndex] = updatedAction;
          
          await db.update(apps)
            .set({ actions: currentActions })
            .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));
          
          return res.status(200).json(updatedAction);
        }
      } catch (error) {
        console.error('Error updating action:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to update action. Please try again.' });
      }
    }
    
    // DELETE request to delete an action
    if (req.method === 'DELETE') {
      const { id, appId } = req.query;
      
      if (!id || !appId) {
        return res.status(400).json({ error: 'Action ID and App ID are required' });
      }
      
      console.log(`Deleting action ${id} from app ${appId}`);
      
      try {
        // First check if the app exists and belongs to the user
        const [app] = await db.select().from(apps)
          .where(and(eq(apps.id, appId), eq(apps.userId, user.id)))
          .limit(1);
        
        if (!app) {
          return res.status(404).json({ error: 'App not found' });
        }
        
        // Try to delete the action from the actions table
        try {
          const result = await db.delete(actions)
            .where(eq(actions.id, id))
            .returning({ id: actions.id });
          
          if (result.length === 0) {
            return res.status(404).json({ error: 'Action not found' });
          }
          
          return res.status(200).json({ success: true });
        } catch (actionsError) {
          console.error('Error deleting from actions table, using JSON field:', actionsError);
          Sentry.captureException(actionsError);
          
          // Fall back to updating the actions JSON in the app record
          let currentActions = [];
          if (app.actions) {
            if (Array.isArray(app.actions)) {
              currentActions = app.actions;
            } else if (typeof app.actions === 'string') {
              try {
                currentActions = JSON.parse(app.actions);
              } catch (parseError) {
                console.error('Error parsing actions:', parseError);
              }
            }
          }
          
          const actionIndex = currentActions.findIndex(a => a.id === id);
          if (actionIndex === -1) {
            return res.status(404).json({ error: 'Action not found' });
          }
          
          currentActions.splice(actionIndex, 1);
          
          await db.update(apps)
            .set({ actions: currentActions })
            .where(and(eq(apps.id, appId), eq(apps.userId, user.id)));
          
          return res.status(200).json({ success: true });
        }
      } catch (error) {
        console.error('Error deleting action:', error);
        Sentry.captureException(error);
        return res.status(500).json({ error: 'Failed to delete action. Please try again.' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in actions endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}