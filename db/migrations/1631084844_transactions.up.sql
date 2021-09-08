ALTER table user_subscriptions DROP COLUMN IF EXISTS payment_data;

CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount FLOAT,
    created TIMESTAMP NOT NULL DEFAULT NULL,
    service VARCHAR(30),
    payment_data jsonb NOT NULL
);

ALTER table user_subscriptions ADD COLUMN IF NOT EXISTS transaction_id uuid REFERENCES transactions(id);