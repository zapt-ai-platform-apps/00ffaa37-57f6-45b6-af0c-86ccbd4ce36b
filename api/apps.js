import { apps } from '../drizzle/schema.js';
import { authenticateUser, getDbClient } from './_apiUtils.js';
import { eq } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const db = getDbClient();

    // GET request to fetch all apps
    if (req.method === 'GET') {
      console.log('Fetching apps for user:', user.id);
      const appsList = await db.select().from(apps).where(eq(apps.userId, user.id));
      return res.status(200).json(appsList);
    }

    // POST request to create a new app
    if (req.method === 'POST') {
      const appData = req.body;
      console.log('Creating new app:', appData);
      
      const [newApp] = await db.insert(apps).values({
        name: appData.name,
        description: appData.description,
        userCount: appData.userCount || 0,
        revenue: appData.revenue || 0,
        userId: user.id,
        strategy: appData.strategy || null,
        actions: appData.actions || [],
        domain: appData.domain || null
      }).returning();
      
      return res.status(201).json(newApp);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in apps endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}