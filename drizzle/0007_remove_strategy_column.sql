-- This migration removes the strategy column from apps table
ALTER TABLE "apps" DROP COLUMN IF EXISTS "strategy";