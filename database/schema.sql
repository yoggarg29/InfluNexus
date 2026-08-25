-- database/schema.sql
-- Run this once to create the database and tables:
--   mysql -u root -p < database/schema.sql
--
-- Design notes (also see INTERVIEW_GUIDE.md):
--   - `users` is the single source of truth for login + role + block status.
--   - `influencer_profiles` and `brand_profiles` are 1-to-1 extensions of a
--     user row, so their primary key is simply the same email, which also
--     doubles as a foreign key back to `users`. This avoids a separate
--     surrogate `user_id` while keeping a clean relationship.
--   - `events` is 1-to-many: one influencer can post many events.

CREATE DATABASE IF NOT EXISTS influnexus;
USE influnexus;

-- ---------------------------------------------------------------
-- users: every account (influencer, brand, or admin) row lives here
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    email      VARCHAR(100) PRIMARY KEY,
    password   VARCHAR(255) NOT NULL,               -- bcrypt hash, never plain text
    user_type  ENUM('INFLUENCER', 'BRAND', 'ADMIN') NOT NULL,
    status     TINYINT(1) NOT NULL DEFAULT 1,        -- 1 = active, 0 = blocked by admin
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- influencer_profiles: extra details for accounts of type INFLUENCER
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS influencer_profiles (
    email             VARCHAR(100) PRIMARY KEY,
    full_name         VARCHAR(100) NOT NULL,
    profile_picture   VARCHAR(255) DEFAULT 'nopic.svg',
    phone             VARCHAR(20)  NOT NULL,
    gender            VARCHAR(20)  NOT NULL,
    dob               DATE         NOT NULL,
    address           VARCHAR(255) NOT NULL,
    city              VARCHAR(100) NOT NULL,
    state             VARCHAR(100) NOT NULL,
    pincode           VARCHAR(10)  NOT NULL,
    content_type      VARCHAR(255) NOT NULL,        -- comma-separated list, e.g. "Fashion,Travel"
    instagram_handle  VARCHAR(100),
    youtube_channel   VARCHAR(100),
    twitter_handle    VARCHAR(100),
    other_details     TEXT,
    CONSTRAINT fk_influencer_user
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

-- Search by city / content type is the main query on this table,
-- so both are indexed.
CREATE INDEX idx_influencer_city ON influencer_profiles (city);
CREATE INDEX idx_influencer_content_type ON influencer_profiles (content_type(50));

-- ---------------------------------------------------------------
-- brand_profiles: extra details for accounts of type BRAND
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brand_profiles (
    email       VARCHAR(100) PRIMARY KEY,
    brand_name  VARCHAR(100) NOT NULL,
    phone       VARCHAR(20)  NOT NULL,
    org_type    VARCHAR(100) NOT NULL,   -- e.g. "Individual" or "Organisation"
    address     VARCHAR(255) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    pincode     VARCHAR(10)  NOT NULL,
    CONSTRAINT fk_brand_user
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- events: bookings posted by influencers
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    event_id    INT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(100) NOT NULL,
    title       VARCHAR(150) NOT NULL,
    event_date  DATE NOT NULL,
    start_time  TIME NOT NULL,
    place       VARCHAR(150) NOT NULL,
    location    VARCHAR(255) NOT NULL,
    CONSTRAINT fk_event_influencer
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE INDEX idx_event_email ON events (email);

-- ---------------------------------------------------------------
-- Optional: create a first admin account.
-- The password below is the bcrypt hash of "Admin@123".
-- Generate your own with: node -e "console.log(require('bcrypt').hashSync('yourpassword', 10))"
-- ---------------------------------------------------------------
-- INSERT INTO users (email, password, user_type, status)
-- VALUES ('admin@influnexus.com', '$2b$10$replace_with_a_real_bcrypt_hash', 'ADMIN', 1);

INSERT INTO users (email, password, user_type, status)
VALUES (
    'admin@influnexus.com',
    '$2b$10$s8aMzCP2TcK9cAINkTxX4.4snl/t5cHmXzU3cRWo3lXhSxSpULz7O',
    'ADMIN',
    1
);
SELECT email, user_type, status
FROM users
WHERE email = 'admin@influnexus.com';

