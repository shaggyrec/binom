ALTER TABLE topics DROP COLUMN IF EXISTS course_id;
ALTER TABLE topics DROP COLUMN IF EXISTS price;
DROP TABLE IF EXISTS courses CASCADE ;