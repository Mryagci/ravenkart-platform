-- =====================================================
-- RAVENKART COMPLETE DATABASE SETUP
-- All tables and configurations in one SQL file
-- =====================================================

-- Clean existing tables if needed (DEV only)
-- DROP TABLE IF EXISTS qr_analytics CASCADE;
-- DROP TABLE IF EXISTS subscriptions CASCADE;
-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS cards CASCADE;

-- =====================================================
-- 1. CARDS TABLOSU
-- =====================================================
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

-- =====================================================
-- 2. QR ANALYTICS TABLOSU
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PAYMENTS TABLOSU
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    plan_type TEXT NOT NULL,
    billing_cycle TEXT, -- monthly or yearly
    status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
    paytr_token TEXT,
    payment_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 4. SUBSCRIPTIONS TABLOSU
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
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

-- =====================================================
-- 5. INDEX'LER
-- =====================================================

-- Cards tablosu index'leri
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_username ON cards(username);
CREATE INDEX IF NOT EXISTS idx_cards_is_active ON cards(is_active);

-- QR Analytics index'leri
CREATE INDEX IF NOT EXISTS idx_qr_analytics_card_id ON qr_analytics(card_id);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_scanned_at ON qr_analytics(scanned_at);

-- Payments index'leri
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Subscriptions index'leri
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) AKTIFLEŞTIR
-- =====================================================
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CARDS TABLOSU RLS POLİTİKALARI
-- =====================================================

-- Kullanıcılar kendi kartlarını görebilir
CREATE POLICY "Users can view their own cards" ON cards
    FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar kendi kartlarını ekleyebilir
CREATE POLICY "Users can insert their own cards" ON cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi kartlarını güncelleyebilir
CREATE POLICY "Users can update their own cards" ON cards
    FOR UPDATE USING (auth.uid() = user_id);

-- Kullanıcılar kendi kartlarını silebilir
CREATE POLICY "Users can delete their own cards" ON cards
    FOR DELETE USING (auth.uid() = user_id);

-- Herkes aktif kartları username ile görebilir (public access)
CREATE POLICY "Anyone can view active cards by username" ON cards
    FOR SELECT USING (is_active = true);

-- =====================================================
-- 8. QR ANALYTICS RLS POLİTİKALARI
-- =====================================================

-- Kullanıcılar kendi kartlarının analitiklerini görebilir
CREATE POLICY "Users can view analytics for their own cards" ON qr_analytics
    FOR SELECT USING (
        card_id IN (
            SELECT id FROM cards WHERE user_id = auth.uid()
        )
    );

-- Herkes QR analytics ekleyebilir (tarama kayıtları için)
CREATE POLICY "Anyone can insert QR analytics" ON qr_analytics
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 9. PAYMENTS RLS POLİTİKALARI
-- =====================================================

-- Kullanıcılar kendi ödemelerini görebilir
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- Service role tüm payment işlemlerini yapabilir
CREATE POLICY "Service role can manage payments" ON payments
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- 10. SUBSCRIPTIONS RLS POLİTİKALARI  
-- =====================================================

-- Kullanıcılar kendi aboneliklerini görebilir
CREATE POLICY "Users can view their own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Service role tüm subscription işlemlerini yapabilir
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- 11. TRIGGER FONKSİYONLARI
-- =====================================================

-- Updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Cards tablosu için updated_at trigger
DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at 
    BEFORE UPDATE ON cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Subscriptions tablosu için updated_at trigger
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. UTILITY FONKSİYONLARI
-- =====================================================

-- Benzersiz username oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION generate_unique_username(base_name TEXT)
RETURNS TEXT AS $$
DECLARE
    username TEXT;
    counter INTEGER := 0;
BEGIN
    -- İsmi temizle ve küçük harfe çevir
    base_name := lower(trim(regexp_replace(base_name, '[^a-zA-Z0-9]', '', 'g')));
    
    -- Boş ise varsayılan değer
    IF base_name = '' THEN
        base_name := 'user';
    END IF;
    
    username := base_name;
    
    -- Unique username bul
    WHILE EXISTS (SELECT 1 FROM cards WHERE cards.username = username) LOOP
        counter := counter + 1;
        username := base_name || counter::TEXT;
    END LOOP;
    
    RETURN username;
END;
$$ LANGUAGE plpgsql;

-- Aktif abonelik kontrolü fonksiyonu
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

-- Kullanıcının plan tipini getiren fonksiyon
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
-- 13. ÖRNEK VERİLER (TEST İÇİN - OPSİYONEL)
-- =====================================================

-- Test kullanıcısı için örnek kart (sadece development için)
/*
INSERT INTO cards (
    user_id,
    username,
    name,
    title,
    company,
    email,
    phone,
    website,
    location,
    qr_redirect_url,
    social_media
) VALUES (
    auth.uid(), -- Bu gerçek bir user_id ile değiştirilmeli
    'demo-user',
    'Demo Kullanıcı',
    'Yazılım Geliştiricisi',
    'Ravenkart',
    'demo@ravenkart.com',
    '+90 555 123 45 67',
    'https://ravenkart.com',
    'İstanbul, Türkiye',
    'https://ravenkart.com',
    '{"linkedin": "demo-user", "twitter": "demo_user"}'::jsonb
) ON CONFLICT (username) DO NOTHING;
*/

-- =====================================================
-- 14. VERİTABAN VİEW'LERI (RAPORLAR İÇİN)
-- =====================================================

-- Kullanıcı istatistikleri view'i
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

-- Ödeme istatistikleri view'i
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
-- 15. YEDEKLEME VE RESTORE KOMUTLARI (REFERANS)
-- =====================================================

/*
-- Yedekleme
pg_dump -h your-host -U your-user -d your-database > ravenkart_backup.sql

-- Restore
psql -h your-host -U your-user -d your-database < ravenkart_backup.sql

-- Sadece veri yedekleme
pg_dump -h your-host -U your-user -d your-database --data-only > ravenkart_data_backup.sql
*/

-- =====================================================
-- KURULUM TAMAMLANDI
-- =====================================================

-- Kontrol sorgulari:
SELECT 'Cards table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cards');
SELECT 'QR Analytics table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'qr_analytics');  
SELECT 'Payments table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments');
SELECT 'Subscriptions table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions');

-- Bu SQL'i Supabase SQL Editor'da calistirdiktan sonra sistemin tamami hazir olacak!