-- This migration ensures the apps table exists with all required columns
CREATE TABLE IF NOT EXISTS "apps" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "user_count" INTEGER DEFAULT 0,
  "revenue" NUMERIC(10, 2) DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "user_id" UUID NOT NULL,
  "strategy" TEXT,
  "actions" JSONB DEFAULT '[]'::JSONB,
  "domain" TEXT,
  "is_public" BOOLEAN DEFAULT FALSE
);