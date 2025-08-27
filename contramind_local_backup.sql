-- ContraMind Database Backup
-- Generated on Wed Aug 27 03:45:30 PM UTC 2025
-- 
-- PostgreSQL database dump

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA IF NOT EXISTS public;

SET search_path TO public;

--
-- Table structure for users
--

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR,
    phone VARCHAR,
    company VARCHAR,
    role VARCHAR DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    google_id VARCHAR UNIQUE,
    microsoft_id VARCHAR UNIQUE,
    profile_image VARCHAR,
    refresh_token VARCHAR
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
    user_id VARCHAR REFERENCES users(id),
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
    user_id VARCHAR REFERENCES users(id),
    message TEXT NOT NULL,
    role VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for saved_prompts
--

CREATE TABLE IF NOT EXISTS saved_prompts (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id),
    prompt_text TEXT NOT NULL,
    category VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for parties
--

CREATE TABLE IF NOT EXISTS parties (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id),
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
    user_id VARCHAR REFERENCES users(id),
    session_token VARCHAR NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- ContraMind Database Data Dump
-- Generated on $(date)
--

-- Disable triggers and constraints during import
SET session_replication_role = replica;

--
-- Data for users table (sample data - sanitized)
--

INSERT INTO users (id, name, email, password, phone, company, role, email_verified, created_at) VALUES
('user-1', 'Demo User', 'demo@contramind.ai', 'demo123', NULL, 'ContraMind', 'admin', true, '2025-01-01 00:00:00'),
('user-2', 'Test User', 'test@contramind.ai', 'test123', NULL, 'Test Company', 'user', true, '2025-01-02 00:00:00')
ON CONFLICT (id) DO NOTHING;

--
-- Data for waitlist_entries table (sample entries)
--

INSERT INTO waitlist_entries (email, created_at) VALUES
('user1@example.com', '2025-01-01 10:00:00'),
('user2@example.com', '2025-01-01 11:00:00'),
('user3@example.com', '2025-01-01 12:00:00'),
('user4@example.com', '2025-01-02 09:00:00'),
('user5@example.com', '2025-01-02 10:00:00')
ON CONFLICT DO NOTHING;

--
-- Data for contact_messages table (sample messages)
--

INSERT INTO contact_messages (name, email, phone, company, message, created_at) VALUES
('John Doe', 'john@example.com', '+1234567890', 'Tech Corp', 'Interested in enterprise plan', '2025-01-01 14:00:00'),
('Jane Smith', 'jane@example.com', '+9876543210', 'Legal Firm', 'Need demo for contract analysis', '2025-01-02 15:00:00'),
('Ahmed Ali', 'ahmed@example.com', '+966501234567', 'Saudi Corp', 'مهتم بالحلول القانونية', '2025-01-03 16:00:00')
ON CONFLICT DO NOTHING;

--
-- Data for contracts table (sample contracts)
--

INSERT INTO contracts (id, user_id, file_name, contract_type, parties, risk_level, status, created_at) VALUES
('contract-1', 'user-1', 'Service Agreement.pdf', 'Service Agreement', ARRAY['Party A', 'Party B'], 'low', 'analyzed', '2025-01-01 00:00:00'),
('contract-2', 'user-1', 'NDA.pdf', 'Non-Disclosure Agreement', ARRAY['Company X', 'Company Y'], 'low', 'analyzed', '2025-01-02 00:00:00'),
('contract-3', 'user-2', 'Sales Contract.pdf', 'Sales Agreement', ARRAY['Vendor', 'Client'], 'medium', 'analyzed', '2025-01-03 00:00:00')
ON CONFLICT (id) DO NOTHING;

--
-- Data for saved_prompts table (sample prompts)
--

INSERT INTO saved_prompts (user_id, prompt_text, category, created_at) VALUES
('user-1', 'What are the key terms in this contract?', 'analysis', '2025-01-01 00:00:00'),
('user-1', 'Identify potential risks', 'risk', '2025-01-02 00:00:00'),
('user-1', 'Summarize payment terms', 'finance', '2025-01-03 00:00:00'),
('user-2', 'Extract all dates mentioned', 'extraction', '2025-01-04 00:00:00'),
('user-2', 'List all parties involved', 'parties', '2025-01-05 00:00:00')
ON CONFLICT DO NOTHING;

-- Re-enable triggers and constraints
SET session_replication_role = DEFAULT;

-- Update sequences to avoid conflicts with new inserts
SELECT setval('waitlist_entries_id_seq', (SELECT MAX(id) FROM waitlist_entries) + 1, false);
SELECT setval('contact_messages_id_seq', (SELECT MAX(id) FROM contact_messages) + 1, false);


--
-- Backup complete
-- To restore this backup:
-- 1. Create database: createdb contramind
-- 2. Import: psql -U postgres contramind < contramind_local_backup.sql
--
