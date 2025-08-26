-- =====================================================
-- STEP 1: CREATE TABLES WITHOUT FOREIGN KEYS FIRST
-- =====================================================

-- 1.1 CARDS TABLOSU (without foreign key initially)
CREATE TABLE IF NOT EXISTS cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
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

-- 1.2 QR ANALYTICS TABLOSU
CREATE TABLE IF NOT EXISTS qr_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    card_id UUID NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.3 PAYMENTS TABLOSU
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    order_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    plan_type TEXT NOT NULL,
    billing_cycle TEXT,
    status TEXT DEFAULT 'pending',
    paytr_token TEXT,
    payment_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 1.4 SUBSCRIPTIONS TABLOSU
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE,
    plan_type TEXT NOT NULL,
    billing_cycle TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    auto_renew BOOLEAN DEFAULT true,
    payment_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 2: ADD FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Add foreign key constraints if auth.users is available
DO $$
BEGIN
    -- Try to add foreign key for cards.user_id
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        ALTER TABLE cards ADD CONSTRAINT fk_cards_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        
        ALTER TABLE payments ADD CONSTRAINT fk_payments_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        
        ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors, foreign keys will be added later when auth is available
        NULL;
END $$;

-- Add internal foreign keys
ALTER TABLE qr_analytics ADD CONSTRAINT fk_qr_analytics_card_id 
FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE;

ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_payment_id 
FOREIGN KEY (payment_id) REFERENCES payments(id);

-- =====================================================
-- STEP 3: CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_username ON cards(username);
CREATE INDEX IF NOT EXISTS idx_cards_is_active ON cards(is_active);

CREATE INDEX IF NOT EXISTS idx_qr_analytics_card_id ON qr_analytics(card_id);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_scanned_at ON qr_analytics(scanned_at);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- =====================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: CREATE RLS POLICIES
-- =====================================================

-- Cards policies
CREATE POLICY "Users can view their own cards" ON cards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards" ON cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" ON cards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" ON cards
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active cards by username" ON cards
    FOR SELECT USING (is_active = true);

-- QR Analytics policies
CREATE POLICY "Users can view analytics for their own cards" ON qr_analytics
    FOR SELECT USING (
        card_id IN (
            SELECT id FROM cards WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert QR analytics" ON qr_analytics
    FOR INSERT WITH CHECK (true);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payments" ON payments
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- STEP 6: CREATE TRIGGERS AND FUNCTIONS
-- =====================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
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
-- STEP 7: UTILITY FUNCTIONS
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

-- Get user plan
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
-- STEP 8: CREATE VIEWS
-- =====================================================

-- User stats view
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

-- Payment stats view
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
-- VERIFICATION
-- =====================================================

SELECT 'Cards table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cards');
SELECT 'QR Analytics table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'qr_analytics');
SELECT 'Payments table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments');
SELECT 'Subscriptions table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions');

SELECT 'Setup completed successfully!' as final_status;