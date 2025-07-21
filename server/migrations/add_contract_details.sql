-- Create contract_details table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index on contract_id for faster lookups
CREATE INDEX idx_contract_details_contract_id ON contract_details(contract_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contract_details_updated_at BEFORE UPDATE
    ON contract_details FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();