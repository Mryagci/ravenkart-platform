-- =====================================================
-- RAVENKART PAYTR COMPLETE SETUP MIGRATION
-- Secure payment processing with idempotency
-- =====================================================

-- 1. CARDS TABLE (if not exists, no modification to existing)
CREATE TABLE IF NOT EXISTS cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    company_logo TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    location TEXT,
    profile_photos TEXT[],
    background_color TEXT DEFAULT '#ffffff',
    ribbon_primary_color TEXT DEFAULT '#8b5cf6',
    ribbon_secondary_color TEXT DEFAULT '#3b82f6', 
    text_color TEXT DEFAULT '#1f2937',
    social_media JSONB DEFAULT '{}',
    projects JSONB DEFAULT '[]',
    qr_code_type TEXT DEFAULT 'full',
    qr_redirect_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. QR ANALYTICS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS qr_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PAYMENTS TABLE (Core PayTR integration)
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id TEXT UNIQUE NOT NULL, -- merchant_oid from PayTR
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    plan_type TEXT NOT NULL,
    billing_cycle TEXT, -- monthly or yearly
    status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
    paytr_token TEXT,
    payment_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. SUBSCRIPTIONS TABLE (User plan management)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL, -- personal, professional, enterprise
    billing_cycle TEXT NOT NULL, -- monthly or yearly  
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    auto_renew BOOLEAN DEFAULT true,
    payment_id UUID REFERENCES payments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. WEBHOOK EVENTS TABLE (Idempotency & Audit)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT UNIQUE NOT NULL, -- deterministic: merchant_oid + status + amount
    raw_payload JSONB NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Cards indexes
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_username ON cards(username);
CREATE INDEX IF NOT EXISTS idx_cards_is_active ON cards(is_active);

-- QR Analytics indexes  
CREATE INDEX IF NOT EXISTS idx_qr_analytics_card_id ON qr_analytics(card_id);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_scanned_at ON qr_analytics(scanned_at);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- Webhook events indexes
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_received_at ON webhook_events(received_at);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- CARDS RLS POLICIES
-- Users can access their own cards
CREATE POLICY "cards_owner_select" ON cards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cards_owner_insert" ON cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cards_owner_update" ON cards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cards_owner_delete" ON cards
    FOR DELETE USING (auth.uid() = user_id);

-- Public can view active cards (for QR redirects)
CREATE POLICY "cards_public_select" ON cards
    FOR SELECT USING (is_active = true);

-- QR ANALYTICS RLS POLICIES
-- Users can view analytics for their own cards
CREATE POLICY "qr_analytics_owner_select" ON qr_analytics
    FOR SELECT USING (
        card_id IN (SELECT id FROM cards WHERE user_id = auth.uid())
    );

-- Anyone can insert QR analytics (for tracking scans)
CREATE POLICY "qr_analytics_public_insert" ON qr_analytics
    FOR INSERT WITH CHECK (true);

-- PAYMENTS RLS POLICIES
-- Users can view their own payments
CREATE POLICY "payments_owner_select" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all payments
CREATE POLICY "payments_service_role" ON payments
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- SUBSCRIPTIONS RLS POLICIES
-- Users can view their own subscription
CREATE POLICY "subscriptions_owner_select" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all subscriptions  
CREATE POLICY "subscriptions_service_role" ON subscriptions
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- WEBHOOK EVENTS RLS POLICIES
-- Only service role can access webhook events
CREATE POLICY "webhook_events_service_role" ON webhook_events
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at 
    BEFORE UPDATE ON cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Generate unique username
CREATE OR REPLACE FUNCTION generate_unique_username(base_name TEXT)
RETURNS TEXT AS $$
DECLARE
    username TEXT;
    counter INTEGER := 0;
BEGIN
    base_name := lower(trim(regexp_replace(base_name, '[^a-zA-Z0-9]', '', 'g')));
    
    IF base_name = '' THEN
        base_name := 'user';
    END IF;
    
    username := base_name;
    
    WHILE EXISTS (SELECT 1 FROM cards WHERE cards.username = username) LOOP
        counter := counter + 1;
        username := base_name || counter::TEXT;
    END LOOP;
    
    RETURN username;
END;
$$ LANGUAGE plpgsql;

-- Check active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE user_id = user_uuid 
        AND is_active = true 
        AND end_date >= CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql;

-- Get user plan type
CREATE OR REPLACE FUNCTION get_user_plan(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_plan TEXT;
BEGIN
    SELECT plan_type INTO user_plan
    FROM subscriptions 
    WHERE user_id = user_uuid 
    AND is_active = true 
    AND end_date >= CURRENT_DATE
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(user_plan, 'free');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS FOR REPORTING (Optional)
-- =====================================================

-- User statistics view
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    c.user_id,
    c.name as user_name,
    c.created_at as card_created_at,
    COUNT(qa.id) as total_qr_scans,
    COUNT(qa.id) FILTER (WHERE qa.scanned_at >= CURRENT_DATE - INTERVAL '7 days') as scans_last_7_days,
    COUNT(qa.id) FILTER (WHERE qa.scanned_at >= CURRENT_DATE - INTERVAL '30 days') as scans_last_30_days,
    s.plan_type,
    s.is_active as has_active_subscription,
    s.end_date as subscription_end_date
FROM cards c
LEFT JOIN qr_analytics qa ON c.id = qa.card_id
LEFT JOIN subscriptions s ON c.user_id = s.user_id AND s.is_active = true
GROUP BY c.user_id, c.name, c.created_at, s.plan_type, s.is_active, s.end_date;

-- Payment statistics view
CREATE OR REPLACE VIEW payment_stats AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    plan_type,
    billing_cycle,
    COUNT(*) as total_payments,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_payments,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_payments,
    SUM(amount) FILTER (WHERE status = 'completed') as total_revenue
FROM payments
GROUP BY DATE_TRUNC('month', created_at), plan_type, billing_cycle
ORDER BY month DESC;

-- =====================================================
-- MIGRATION VERIFICATION
-- =====================================================

-- Check if tables were created successfully
SELECT 'cards' as table_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cards') 
            THEN '✅ EXISTS' 
            ELSE '❌ MISSING' 
       END as status;

SELECT 'qr_analytics' as table_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'qr_analytics') 
            THEN '✅ EXISTS' 
            ELSE '❌ MISSING' 
       END as status;

SELECT 'payments' as table_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') 
            THEN '✅ EXISTS' 
            ELSE '❌ MISSING' 
       END as status;

SELECT 'subscriptions' as table_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions') 
            THEN '✅ EXISTS' 
            ELSE '❌ MISSING' 
       END as status;

SELECT 'webhook_events' as table_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'webhook_events') 
            THEN '✅ EXISTS' 
            ELSE '❌ MISSING' 
       END as status;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('cards', 'qr_analytics', 'payments', 'subscriptions', 'webhook_events')
AND schemaname = 'public';

-- Final status
SELECT '🎉 PayTR Migration Complete' as final_status, NOW() as completed_at;