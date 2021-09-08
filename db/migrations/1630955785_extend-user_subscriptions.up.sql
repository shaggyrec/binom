ALTER table user_subscriptions ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER table user_subscriptions ADD COLUMN IF NOT EXISTS duration INTEGER;