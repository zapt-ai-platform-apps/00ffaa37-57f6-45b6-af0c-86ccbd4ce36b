import { apps } from '../drizzle/schema.js';
import { getDbClient } from './_apiUtils.js';
import { eq } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const db = getDbClient();
    
    // GET request to fetch all public apps
    if (req.method === 'GET') {
      const { userId } = req.query;
      
      console.log('Fetching public apps' + (userId ? ` for user: ${userId}` : ''));
      
      let query = db.select({
        id: apps.id,
        name: apps.name,
        description: apps.description,
        userCount: apps.userCount,
        revenue: apps.revenue,
        createdAt: apps.createdAt,
        domain: apps.domain,
        strategy: apps.strategy,
        actions: apps.actions,
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
      return res.status(200).json(appsList);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in public apps endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}