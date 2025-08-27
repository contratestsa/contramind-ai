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

