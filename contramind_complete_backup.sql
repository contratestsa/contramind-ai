-- ContraMind Database Complete Backup
-- Generated on $(date)
-- 
-- PostgreSQL database dump with correct structure

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS public;
SET search_path TO public;

--
-- Table structure for users (corrected)
--

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token TEXT,
    has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE,
    profile_picture TEXT,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    company_name_en TEXT,
    company_name_ar TEXT,
    country TEXT DEFAULT 'saudi-arabia',
    contract_role TEXT
);

--
-- Table structure for waitlist_entries
--

CREATE TABLE IF NOT EXISTS waitlist_entries (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for contact_messages
--

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    company VARCHAR,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for contracts
--

CREATE TABLE IF NOT EXISTS contracts (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR,
    file_name VARCHAR,
    file_path VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contract_type VARCHAR,
    parties TEXT[],
    risk_level VARCHAR,
    contract_date VARCHAR,
    payment_details TEXT,
    risk_phrases TEXT[],
    status VARCHAR DEFAULT 'pending',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for contract_details
--

CREATE TABLE IF NOT EXISTS contract_details (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id VARCHAR REFERENCES contracts(id) ON DELETE CASCADE,
    field_name VARCHAR NOT NULL,
    field_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for contract_chats
--

CREATE TABLE IF NOT EXISTS contract_chats (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id VARCHAR REFERENCES contracts(id),
    user_id VARCHAR,
    message TEXT NOT NULL,
    role VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for saved_prompts
--

CREATE TABLE IF NOT EXISTS saved_prompts (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR,
    prompt_text TEXT NOT NULL,
    category VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for parties
--

CREATE TABLE IF NOT EXISTS parties (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR,
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone VARCHAR,
    company VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for user_sessions
--

CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR,
    session_token VARCHAR NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Sample Data
--

-- Users with proper structure
INSERT INTO users (username, password, email, full_name, email_verified, country, company_name_en, company_name_ar) VALUES
('demo_user', '$2b$10$YourHashedPasswordHere', 'demo@contramind.ai', 'Demo User', true, 'saudi-arabia', 'ContraMind', 'كونترامايند'),
('test_user', '$2b$10$YourHashedPasswordHere', 'test@contramind.ai', 'Test User', true, 'saudi-arabia', 'Test Company', 'شركة الاختبار')
ON CONFLICT DO NOTHING;

-- Sample waitlist entries
INSERT INTO waitlist_entries (email, created_at) VALUES
('user1@example.com', '2025-01-01 10:00:00'),
('user2@example.com', '2025-01-01 11:00:00'),
('user3@example.com', '2025-01-01 12:00:00'),
('user4@example.com', '2025-01-02 09:00:00'),
('user5@example.com', '2025-01-02 10:00:00')
ON CONFLICT DO NOTHING;

-- Sample contact messages
INSERT INTO contact_messages (name, email, phone, company, message, created_at) VALUES
('John Doe', 'john@example.com', '+1234567890', 'Tech Corp', 'Interested in enterprise plan', '2025-01-01 14:00:00'),
('Jane Smith', 'jane@example.com', '+9876543210', 'Legal Firm', 'Need demo for contract analysis', '2025-01-02 15:00:00'),
('Ahmed Ali', 'ahmed@example.com', '+966501234567', 'Saudi Corp', 'مهتم بالحلول القانونية', '2025-01-03 16:00:00')
ON CONFLICT DO NOTHING;

-- Reset sequences
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM users), false);
SELECT setval('waitlist_entries_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM waitlist_entries), false);
SELECT setval('contact_messages_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM contact_messages), false);

--
-- Backup complete
-- To restore: psql -U postgres contramind < contramind_complete_backup.sql
--
