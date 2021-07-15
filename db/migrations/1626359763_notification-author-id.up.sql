ALTER TABLE notifications DROP COLUMN IF EXISTS author;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS author_id uuid references users(id);