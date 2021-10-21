CREATE TABLE IF NOT EXISTS posts (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id uuid REFERENCES users(id),
     text TEXT NOT NULL,
     images jsonb,
     likes jsonb,
     created TIMESTAMP NOT NULL DEFAULT NOW(),
     updated TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_comments (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     post_id uuid REFERENCES posts(id) NOT NULL,
     user_id uuid REFERENCES users(id) NOT NULL,
     reply_to uuid REFERENCES post_comments(id),
     text TEXT NOT NULL,
     images jsonb,
     likes jsonb,
     created TIMESTAMP NOT NULL DEFAULT NOW(),
     updated TIMESTAMP
);