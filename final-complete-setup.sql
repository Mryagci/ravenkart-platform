-- RAVENKART COMPLETE DATABASE SETUP
-- Clean version with proper syntax

-- 1. CARDS TABLE
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

-- 2. QR ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS qr_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PAYMENTS TABLE
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

-- 4. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE,
    plan_type TEXT NOT NULL,
    billing_cycle TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    auto_renew BOOLEAN DEFAULT true,
    payment_id UUID REFERENCES payments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INDEXES
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

-- 6. UTILITY FUNCTIONS
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

-- 7. TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. TRIGGERS
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

-- VERIFICATION
SELECT 'Database setup completed successfully' as status;