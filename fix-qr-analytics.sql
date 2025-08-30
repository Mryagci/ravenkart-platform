-- QR Analytics table creation with proper permissions
-- Run this in Supabase SQL Editor

-- Drop existing table if exists (to recreate without RLS issues)
DROP TABLE IF EXISTS qr_analytics CASCADE;

-- Create QR analytics table
CREATE TABLE qr_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_qr_analytics_card_id ON qr_analytics(card_id);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_scanned_at ON qr_analytics(scanned_at);

-- Allow public access for anonymous tracking (no RLS)
-- This allows anyone to insert analytics data when visiting cards
-- This is intentional for public card view tracking

-- Grant permissions to anon role
GRANT SELECT, INSERT ON qr_analytics TO anon;
GRANT SELECT, INSERT ON qr_analytics TO authenticated;

-- Optional: Enable RLS but allow all operations
ALTER TABLE qr_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert analytics (for public card views)
CREATE POLICY "Allow public analytics insert" ON qr_analytics
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Policy: Users can view analytics for their own cards
CREATE POLICY "Users can view their card analytics" ON qr_analytics
    FOR SELECT 
    USING (
        card_id IN (
            SELECT id FROM cards WHERE user_id = auth.uid()
        )
    );

-- Policy: Allow public read for analytics queries (needed for dashboard)
CREATE POLICY "Allow analytics read" ON qr_analytics
    FOR SELECT TO anon, authenticated
    USING (true);