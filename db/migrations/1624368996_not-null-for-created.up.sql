UPDATE topics SET created = NOW() where created IS NULL;
ALTER TABLE topics ALTER COLUMN created SET NOT NULL;
UPDATE users SET created = NOW() where created IS NULL;
ALTER TABLE users ALTER COLUMN created SET NOT NULL;
UPDATE lessons SET created = NOW() where created IS NULL;
ALTER TABLE lessons ALTER COLUMN created SET NOT NULL;