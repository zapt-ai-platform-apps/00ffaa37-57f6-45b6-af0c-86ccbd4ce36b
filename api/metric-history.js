import { authenticateUser, getDbClient } from './_apiUtils.js';
import { metricHistory } from '../drizzle/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('API: metric-history endpoint called');
  
  try {
    const user = await authenticateUser(req);
    const db = getDbClient();
    
    if (req.method === 'GET') {
      // Get metric history for an app
      const { appId, metricType, limit = 30 } = req.query;
      
      if (!appId) {
        return res.status(400).json({ error: 'App ID is required' });
      }
      
      if (!metricType) {
        return res.status(400).json({ error: 'Metric type is required' });
      }
      
      console.log(`Fetching metric history for app ${appId}, metric type ${metricType}, limit ${limit}`);
      
      const history = await db.select()
        .from(metricHistory)
        .where(
          and(
            eq(metricHistory.appId, appId),
            eq(metricHistory.metricType, metricType)
          )
        )
        .orderBy(desc(metricHistory.recordedAt))
        .limit(parseInt(limit, 10));
      
      console.log(`Found ${history.length} history records`);
      return res.status(200).json(history);
    } 
    else if (req.method === 'POST') {
      // Record a new metric data point
      const { appId, metricType, value } = req.body;
      
      if (!appId) {
        return res.status(400).json({ error: 'App ID is required' });
      }
      
      if (!metricType) {
        return res.status(400).json({ error: 'Metric type is required' });
      }
      
      if (value === undefined || value === null) {
        return res.status(400).json({ error: 'Value is required' });
      }
      
      console.log(`Recording new metric: ${metricType} = ${value} for app ${appId}`);
      
      const result = await db.insert(metricHistory)
        .values({
          appId,
          metricType,
          value,
        })
        .returning();
      
      return res.status(201).json(result[0]);
    } 
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in metric-history API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}