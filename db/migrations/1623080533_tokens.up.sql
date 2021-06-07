CREATE TABLE IF NOT EXISTS tokens (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    token TEXT NOT NULL,
    created TIMESTAMP DEFAULT NOW()
);