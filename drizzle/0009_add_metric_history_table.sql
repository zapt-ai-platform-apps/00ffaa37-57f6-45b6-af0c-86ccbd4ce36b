CREATE TABLE IF NOT EXISTS "metric_history" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "app_id" UUID NOT NULL,
  "metric_type" TEXT NOT NULL,
  "value" NUMERIC NOT NULL,
  "recorded_at" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_app FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE
);

-- Create an index to make queries more efficient
CREATE INDEX IF NOT EXISTS idx_metric_history_app_id_type 
ON "metric_history" ("app_id", "metric_type");