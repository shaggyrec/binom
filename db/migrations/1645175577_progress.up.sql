CREATE TABLE IF NOT EXISTS progresses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id),
    lesson_id uuid REFERENCES lessons(id),
    score VARCHAR(255),
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    finished TIMESTAMP
);