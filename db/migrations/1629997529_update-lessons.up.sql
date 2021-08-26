ALTER TABLE lessons ADD COLUMN IF NOT EXISTS task_files jsonb;
ALTER TABLE lessons DROP COLUMN IF EXISTS video;
ALTER TABLE lessons ADD COLUMN video jsonb;