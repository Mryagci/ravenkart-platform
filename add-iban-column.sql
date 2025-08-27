-- Add IBAN column to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS iban TEXT;

-- Add IBAN field to the insert policy (already works since it's a generic field)
-- No additional policy changes needed since the owner policies already cover all fields