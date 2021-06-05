CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS "user" (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topic (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    text TEXT,
    pos INTEGER,
    created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS lesson (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    topic_id uuid references topic(id) ON DELETE SET NULL,
    video TEXT,
    text TEXT,
    task TEXT,
    extra JSONB,
    pos INTEGER,
    created TIMESTAMP DEFAULT NOW()
);