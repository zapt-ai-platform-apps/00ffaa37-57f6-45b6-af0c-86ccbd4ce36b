import { apps } from '../drizzle/schema.js';
import { getDbClient } from './_apiUtils.js';
import { eq } from 'drizzle-orm';
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
      
      const [app] = await db.select({
        id: apps.id,
        name: apps.name,
        description: apps.description,
        userCount: apps.userCount,
        revenue: apps.revenue,
        createdAt: apps.createdAt,
        strategy: apps.strategy,
        actions: apps.actions,
        domain: apps.domain
      }).from(apps)
        .where(eq(apps.id, id))
        .limit(1);
      
      if (!app) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      return res.status(200).json(app);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in public app endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}