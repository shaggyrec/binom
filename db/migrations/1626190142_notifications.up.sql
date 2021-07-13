CREATE TABLE IF NOT EXISTS notifications (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     message TEXT,
     type INTEGER DEFAULT 1,
     created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_notifications (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      notification_id uuid NOT NULL references notifications(id) ON DELETE CASCADE,
      user_id uuid NOT NULL references users(id),
      viewed BOOLEAN DEFAULT FALSE
);