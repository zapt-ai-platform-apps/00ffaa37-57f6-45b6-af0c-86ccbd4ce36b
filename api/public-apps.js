import { apps } from '../drizzle/schema.js';
import { getDbClient } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    // All GET request should work without authentication
    const db = getDbClient();
    
    // GET request to fetch all public apps
    if (req.method === 'GET') {
      console.log('Fetching all public apps');
      
      const appsList = await db.select({
        id: apps.id,
        name: apps.name,
        description: apps.description,
        userCount: apps.userCount,
        revenue: apps.revenue,
        createdAt: apps.createdAt,
        domain: apps.domain,
        strategy: apps.strategy,
        actions: apps.actions
      }).from(apps);
      
      return res.status(200).json(appsList);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in public apps endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}