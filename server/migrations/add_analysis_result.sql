-- Add analysisResult field to contracts table for storing Gemini analysis
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS analysis_result JSONB;

-- Create index for better performance when querying analysis results
CREATE INDEX IF NOT EXISTS idx_contracts_analysis_result 
ON contracts USING gin (analysis_result);

-- Add comment describing the field
COMMENT ON COLUMN contracts.analysis_result IS 'Full Gemini analysis result with 4 categories (Legal, Business, Technical, Shariah) and metadata';