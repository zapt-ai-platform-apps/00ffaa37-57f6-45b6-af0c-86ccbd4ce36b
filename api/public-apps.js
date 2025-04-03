import { apps } from '../drizzle/schema.js';
import { getDbClient } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    console.log('Processing public apps request');
    
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const db = getDbClient();
    const appsList = await db.select().from(apps);
    
    console.log(`Found ${appsList.length} apps for public view`);
    return res.status(200).json(appsList);
  } catch (error) {
    console.error('Error in public apps endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}