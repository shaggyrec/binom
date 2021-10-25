CREATE TABLE IF NOT EXISTS utm (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id),
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    url VARCHAR(255),
    extra VARCHAR(255)
)