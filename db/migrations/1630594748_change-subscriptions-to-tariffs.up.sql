ALTER TABLE user_subscriptions DROP COLUMN subscription_id;
ALTER TABLE subscriptions RENAME TO tariffs;

ALTER table user_subscriptions ADD COLUMN tariff_id INTEGER references tariffs(id);

ALTER table tariffs DROP COLUMN price;
ALTER table tariffs DROP COLUMN duration;

CREATE TABLE tariff_prices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tariff_id INTEGER references tariffs(id),
    price INTEGER not null,
    duration INTEGER not null,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    rise_on INTEGER,
    rise_period INTEGER
);