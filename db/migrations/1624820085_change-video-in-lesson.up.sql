ALTER TABLE lessons DROP COLUMN IF EXISTS video;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video uuid references files(id);