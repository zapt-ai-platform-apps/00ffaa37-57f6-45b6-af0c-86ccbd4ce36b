import { apps } from '../drizzle/schema.js';
import { getDbClient } from './_apiUtils.js';
import { eq } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'App ID is required' });
    }
    
    console.log(`Processing public GET request for app ${id}`);
    
    const db = getDbClient();
    const [app] = await db.select().from(apps)
      .where(eq(apps.id, id))
      .limit(1);
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    return res.status(200).json(app);
  } catch (error) {
    console.error('Error in public app detail endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}