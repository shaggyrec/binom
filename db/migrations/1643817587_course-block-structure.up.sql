CREATE TABLE IF NOT EXISTS courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    text TEXT,
    pos INTEGER,
    active BOOLEAN DEFAULT FALSE,
    alias VARCHAR(255) UNIQUE NOT NULL,
    created TIMESTAMP DEFAULT NOW()
);

INSERT INTO courses (id, name, text, pos, active, alias)
VALUES ('00000000-0000-0000-0000-000000000000', 'ЕГЭ математика годовой', 'ЕГЭ математика годовой курс', 1, FALSE, 'ege-year');
INSERT INTO courses (id, name, text, pos, active, alias)
VALUES ('00000000-0000-0000-0000-000000000001', 'ЕГЭ математика по темам', 'ЕГЭ математика по темам', 1, FALSE, 'ege-blocks');

ALTER TABLE topics ADD COLUMN IF NOT EXISTS course_id uuid references courses(id) ON DELETE CASCADE;
UPDATE topics SET course_id = '00000000-0000-0000-0000-000000000000' WHERE topics.course_id IS NULL;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 1990;