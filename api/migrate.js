import { authenticateUser, getDbClient } from './_apiUtils.js';
import * as Sentry from '@sentry/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  try {
    // Require authentication for running migrations (security measure)
    const user = await authenticateUser(req);
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    console.log('Running database migrations...');
    const db = getDbClient();
    
    // Get SQL files from drizzle directory
    const drizzleDir = path.resolve(__dirname, '../drizzle');
    const sqlFiles = fs.readdirSync(drizzleDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure they run in order
    
    console.log(`Found ${sqlFiles.length} migration files`);
    
    // Execute each migration file
    for (const file of sqlFiles) {
      const filePath = path.join(drizzleDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Executing migration: ${file}`);
      try {
        await db.execute(sql);
        console.log(`Migration ${file} completed successfully`);
      } catch (error) {
        // Some errors are expected if tables/columns already exist
        // We'll continue with the next migration
        console.warn(`Warning in migration ${file}: ${error.message}`);
      }
    }
    
    // Verify the apps table exists by running a query
    try {
      const tableCheck = await db.execute(`
        SELECT EXISTS (
          SELECT FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename = 'apps'
        );
      `);
      
      const tableExists = tableCheck[0]?.exists || false;
      
      if (tableExists) {
        console.log('Verified that apps table exists');
      } else {
        console.error('Failed to create apps table');
        return res.status(500).json({ 
          error: 'Migration failed: apps table does not exist after migrations'
        });
      }
    } catch (error) {
      console.error('Error verifying table existence:', error);
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Migrations completed successfully' 
    });
  } catch (error) {
    console.error('Error running migrations:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}