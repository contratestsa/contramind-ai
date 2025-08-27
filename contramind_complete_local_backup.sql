-- ContraMind Database Complete Backup - Accurate Schema
-- Generated for local development
-- PostgreSQL database dump with exact production structure

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

-- Create schema if needed
CREATE SCHEMA IF NOT EXISTS public;
SET search_path TO public;

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--
-- Table: users
--
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
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
-- Table: contracts
--
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'draft',
    risk_level VARCHAR NOT NULL DEFAULT 'medium',
    parties TEXT,
    value NUMERIC,
    currency VARCHAR DEFAULT 'USD',
    start_date DATE,
    end_date DATE,
    file_path VARCHAR,
    analysis_result TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    title TEXT,
    party_name TEXT,
    last_viewed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: contract_details
--
CREATE TABLE IF NOT EXISTS contract_details (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    executed_status BOOLEAN DEFAULT FALSE,
    language TEXT,
    internal_parties TEXT[],
    counterparties TEXT[],
    governing_law TEXT,
    payment_term TEXT,
    breach_notice TEXT,
    termination_notice TEXT,
    extracted_text TEXT,
    extraction_metadata TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: contract_chats
--
CREATE TABLE IF NOT EXISTS contract_chats (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    role VARCHAR NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

--
-- Table: parties
--
CREATE TABLE IF NOT EXISTS parties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    name_ar TEXT,
    type TEXT NOT NULL,
    registration_number TEXT,
    registration_type TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    address_ar TEXT,
    source_contract_id INTEGER REFERENCES contracts(id),
    extracted_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    is_highlighted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

--
-- Table: saved_prompts
--
CREATE TABLE IF NOT EXISTS saved_prompts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR NOT NULL,
    prompt TEXT NOT NULL,
    category VARCHAR DEFAULT 'general',
    is_system BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

--
-- Table: waitlist_entries
--
CREATE TABLE IF NOT EXISTS waitlist_entries (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT DEFAULT '',
    job_title TEXT DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    phone_number TEXT NOT NULL
);

--
-- Table: contact_messages
--
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

--
-- Table: user_sessions (for session management)
--
CREATE TABLE IF NOT EXISTS user_sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

-- Create index for session expiry
CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions(expire);

--
-- Sample Data for Testing
--

-- Insert sample users
INSERT INTO users (username, password, email, full_name, email_verified, company_name_en, company_name_ar) VALUES
('demo_user', 'demo123', 'demo@contramind.ai', 'Demo User', true, 'ContraMind Demo', 'كونترامايند تجريبي'),
('test_user', 'test123', 'test@contramind.ai', 'Test User', true, 'Test Company', 'شركة الاختبار')
ON CONFLICT (username) DO NOTHING;

-- Get the user IDs for foreign key references
DO $$
DECLARE
    demo_user_id INTEGER;
    test_user_id INTEGER;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE username = 'demo_user';
    SELECT id INTO test_user_id FROM users WHERE username = 'test_user';

    -- Insert sample contracts for demo user
    INSERT INTO contracts (user_id, name, type, status, risk_level, parties, title, party_name) VALUES
    (demo_user_id, 'Service Agreement 2025', 'Service Agreement', 'analyzed', 'low', 'Party A, Party B', 'Professional Services Contract', 'Tech Solutions Inc'),
    (demo_user_id, 'NDA Agreement', 'Non-Disclosure Agreement', 'analyzed', 'low', 'Company X, Company Y', 'Mutual Non-Disclosure Agreement', 'Innovation Corp'),
    (test_user_id, 'Sales Contract Q1', 'Sales Agreement', 'analyzed', 'medium', 'Vendor, Client', 'Product Sales Agreement', 'Global Trading Co')
    ON CONFLICT DO NOTHING;

    -- Insert sample parties
    INSERT INTO parties (user_id, name, name_ar, type, email, phone) VALUES
    (demo_user_id, 'Tech Solutions Inc', 'شركة الحلول التقنية', 'company', 'contact@techsolutions.com', '+966501234567'),
    (demo_user_id, 'Innovation Corp', 'شركة الابتكار', 'company', 'info@innovation.com', '+966509876543'),
    (test_user_id, 'Global Trading Co', 'شركة التجارة العالمية', 'company', 'sales@globaltrading.com', '+966555555555')
    ON CONFLICT DO NOTHING;

    -- Insert system prompts (available to all users)
    INSERT INTO saved_prompts (user_id, title, prompt, category, is_system) VALUES
    (NULL, 'Extract Key Terms', 'What are the key terms and conditions in this contract?', 'analysis', true),
    (NULL, 'Identify Risks', 'Identify all potential risks and liabilities in this contract', 'risk', true),
    (NULL, 'Payment Terms', 'Summarize all payment terms and financial obligations', 'finance', true),
    (NULL, 'Important Dates', 'List all important dates and deadlines mentioned in the contract', 'dates', true),
    (NULL, 'Party Obligations', 'What are the main obligations of each party?', 'parties', true)
    ON CONFLICT DO NOTHING;

END $$;

-- Insert sample waitlist entries
INSERT INTO waitlist_entries (full_name, email, company, job_title, phone_number) VALUES
('Ahmad Al-Rashid', 'ahmad@example.com', 'Al-Rashid Law Firm', 'Senior Partner', '+966501111111'),
('Fatima Abdullah', 'fatima@example.com', 'Abdullah Consulting', 'Legal Advisor', '+966502222222'),
('Mohammed Hassan', 'mohammed@example.com', 'Hassan Industries', 'Contract Manager', '+966503333333')
ON CONFLICT DO NOTHING;

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, subject, message) VALUES
('Sarah Johnson', 'sarah@company.com', 'Enterprise Plan Inquiry', 'We are interested in the enterprise plan for our legal department of 50+ users.'),
('Khalid Al-Faisal', 'khalid@lawfirm.com', 'استفسار عن الخدمات', 'نحن مهتمون بخدماتكم للمراجعة القانونية للعقود التجارية'),
('International Corp', 'procurement@intcorp.com', 'Demo Request', 'Please schedule a demo for our procurement team to evaluate ContraMind.')
ON CONFLICT DO NOTHING;

-- Reset sequences to avoid conflicts
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1) + 1, false);
SELECT setval('contracts_id_seq', COALESCE((SELECT MAX(id) FROM contracts), 1) + 1, false);
SELECT setval('contract_details_id_seq', COALESCE((SELECT MAX(id) FROM contract_details), 1) + 1, false);
SELECT setval('contract_chats_id_seq', COALESCE((SELECT MAX(id) FROM contract_chats), 1) + 1, false);
SELECT setval('parties_id_seq', COALESCE((SELECT MAX(id) FROM parties), 1) + 1, false);
SELECT setval('saved_prompts_id_seq', COALESCE((SELECT MAX(id) FROM saved_prompts), 1) + 1, false);
SELECT setval('waitlist_entries_id_seq', COALESCE((SELECT MAX(id) FROM waitlist_entries), 1) + 1, false);
SELECT setval('contact_messages_id_seq', COALESCE((SELECT MAX(id) FROM contact_messages), 1) + 1, false);

-- Create helper view for recent contracts (optional)
CREATE OR REPLACE VIEW recent_contracts AS
SELECT 
    c.id,
    c.user_id,
    c.name as file_name,
    c.type as contract_type,
    c.parties,
    c.status,
    c.risk_level,
    c.file_path,
    c.created_at,
    c.updated_at,
    c.last_viewed_at,
    u.username,
    u.full_name as user_name
FROM contracts c
JOIN users u ON c.user_id = u.id
ORDER BY c.last_viewed_at DESC;

--
-- Backup complete!
-- 
-- To restore this backup in your local PostgreSQL:
-- 1. Create database: createdb contramind
-- 2. Import: psql -U postgres contramind < contramind_complete_local_backup.sql
--
-- Test credentials:
-- Username: demo_user / Password: demo123
-- Username: test_user / Password: test123
--