DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS lesson;
CREATE TABLE IF NOT EXISTS lessons (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255),
      topic_id uuid references topics(id) ON DELETE SET NULL,
      video TEXT,
      text TEXT,
      task TEXT,
      extra JSONB,
      pos INTEGER,
      alias VARCHAR(255) UNIQUE NOT NULL,
      created TIMESTAMP DEFAULT NOW()
);