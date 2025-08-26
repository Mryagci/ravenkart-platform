-- Contact Info Table for Dynamic Content Management
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default contact information
INSERT INTO contact_info (key, value) VALUES 
(
  'company_details',
  '{
    "name": "Ravenkart Teknoloji Ltd. Şti.",
    "description": "Dijital kartvizit platformu"
  }'::jsonb
),
(
  'emails',
  '{
    "support": "destek@ravenkart.com",
    "sales": "satis@ravenkart.com", 
    "general": "info@ravenkart.com"
  }'::jsonb
),
(
  'phones',
  '{
    "support": "+90 (212) 555-0123",
    "sales": "+90 (212) 555-0124"
  }'::jsonb
),
(
  'address',
  '{
    "street": "Maslak Mahallesi, Büyükdere Cad. No:123",
    "district": "Sarıyer/İstanbul",
    "postal": "34485",
    "country": "Türkiye"
  }'::jsonb
),
(
  'social',
  '{
    "twitter": "@ravenkart",
    "linkedin": "company/ravenkart", 
    "instagram": "@ravenkart"
  }'::jsonb
),
(
  'hours',
  '{
    "weekdays": "09:00 - 18:00",
    "weekend": "Kapalı"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Enable read access for all users" ON "public"."contact_info"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Policy for authenticated admin updates (you can restrict this further)
CREATE POLICY "Enable update for authenticated users" ON "public"."contact_info"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true);