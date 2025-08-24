-- Scanned Cards Table Schema for Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS scanned_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    image_data TEXT, -- Base64 encoded image data
    location VARCHAR(500),
    notes TEXT,
    scanned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Row Level Security (RLS)
ALTER TABLE scanned_cards ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own scanned cards
CREATE POLICY "Users can view their own scanned cards" ON scanned_cards
    FOR SELECT USING (auth.uid() = scanned_cards.user_id);

-- Policy: Users can insert their own scanned cards
CREATE POLICY "Users can insert their own scanned cards" ON scanned_cards
    FOR INSERT WITH CHECK (auth.uid() = scanned_cards.user_id);

-- Policy: Users can update their own scanned cards
CREATE POLICY "Users can update their own scanned cards" ON scanned_cards
    FOR UPDATE USING (auth.uid() = scanned_cards.user_id);

-- Policy: Users can delete their own scanned cards
CREATE POLICY "Users can delete their own scanned cards" ON scanned_cards
    FOR DELETE USING (auth.uid() = scanned_cards.user_id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS scanned_cards_user_id_idx ON scanned_cards(user_id);
CREATE INDEX IF NOT EXISTS scanned_cards_created_at_idx ON scanned_cards(created_at DESC);