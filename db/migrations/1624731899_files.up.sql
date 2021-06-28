CREATE TABLE IF NOT EXISTS files (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT,
     type VARCHAR(255),
     extension VARCHAR(10),
     user_id uuid references users(id),
     created TIMESTAMP DEFAULT NOW()
);