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

