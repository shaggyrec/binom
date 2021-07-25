CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price VARCHAR(10),
    created TIMESTAMP DEFAULT NOW(),
    status INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS user_subscriptions (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id uuid NOT NULL references users(id),
     subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
     paid_price VARCHAR(10),
     created TIMESTAMP DEFAULT NOW(),
     expired  TIMESTAMP NOT NULL,
     status INTEGER NOT NULL,
     topics jsonb
);

CREATE TABLE IF NOT EXISTS subscription_discounts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    price VARCHAR(10),
    condition jsonb,
    created TIMESTAMP DEFAULT NOW(),
    status INTEGER NOT NULL DEFAULT 0
);