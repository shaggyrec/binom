CREATE TABLE IF NOT EXISTS auth_code (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient TEXT,
    code VARCHAR(10),
    created TIMESTAMP DEFAULT NOW(),
    valid BOOLEAN default TRUE
);
CREATE TABLE IF NOT EXISTS sent_email (
    id SERIAL PRIMARY KEY,
    created TIMESTAMP DEFAULT NOW(),
    sender TEXT,
    recipient TEXT,
    subject TEXT,
    body TEXT
);
