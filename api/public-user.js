import { apps } from '../drizzle/schema.js';
import { getDbClient } from './_apiUtils.js';
import { eq } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const db = getDbClient();
    
    // GET request to fetch a user's public dashboard data
    if (req.method === 'GET') {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      console.log(`Fetching public dashboard for user: ${userId}`);
      
      // Get all public apps for this user
      const userApps = await db.select({
        id: apps.id,
        name: apps.name,
        description: apps.description,
        userCount: apps.userCount,
        revenue: apps.revenue,
        createdAt: apps.createdAt,
        domain: apps.domain,
        strategy: apps.strategy,
        actions: apps.actions
      }).from(apps)
        .where(eq(apps.userId, userId));
      
      // Calculate metrics
      const metrics = userApps.reduce(
        (acc, app) => {
          acc.totalUsers += app.userCount || 0;
          acc.totalRevenue += Number(app.revenue) || 0;
          acc.completedActions += (app.actions || []).filter(a => a.completed).length;
          acc.totalActions += (app.actions || []).length;
          return acc;
        },
        { totalApps: userApps.length, totalUsers: 0, totalRevenue: 0, completedActions: 0, totalActions: 0 }
      );
      
      return res.status(200).json({
        apps: userApps,
        metrics
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in public user endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}