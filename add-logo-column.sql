-- Add logo_url column to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS logo_url TEXT;
