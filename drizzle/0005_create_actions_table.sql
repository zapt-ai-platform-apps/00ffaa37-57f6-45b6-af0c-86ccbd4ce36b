-- Create a new table for actions
CREATE TABLE IF NOT EXISTS "actions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "app_id" UUID NOT NULL,
  "text" TEXT NOT NULL,
  "completed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "completed_at" TIMESTAMP,
  CONSTRAINT fk_app FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE
);