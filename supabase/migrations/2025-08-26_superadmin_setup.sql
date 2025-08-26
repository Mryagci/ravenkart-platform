-- =====================================================
-- RAVENKART SUPERADMIN SETUP MIGRATION
-- Admin panel tables and initial data
-- =====================================================

-- 1. SUPERADMINS TABLE
CREATE TABLE IF NOT EXISTS superadmins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{"all": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 1erkinyagci@gmail.com as superadmin
INSERT INTO superadmins (email, permissions) 
VALUES ('1erkinyagci@gmail.com', '{"all": true, "products": true, "pricing": true, "policies": true, "contact": true, "users": true, "payments": true}')
ON CONFLICT (email) DO NOTHING;

-- 2. SITE PRODUCTS TABLE (Dynamic content management)
CREATE TABLE IF NOT EXISTS site_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]',
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default products
INSERT INTO site_products (title, description, features, order_index, is_active) VALUES
('Dijital Kartvizit', 'Modern ve profesyonel dijital kartvizit oluşturun', 
 '["QR Kod ile anında paylaşım", "Sosyal medya entegrasyonu", "Profil fotoğrafı galerisi", "İletişim bilgileri", "Responsive tasarım"]',
 1, true),
('QR Analytics', 'Kartvizitinizin performansını takip edin', 
 '["Tarama istatistikleri", "Ziyaretçi analizi", "Konum bazlı veriler", "Zaman bazlı raporlar", "Export özelliği"]',
 2, true),
('Premium Features', 'Profesyonel özelliklerle fark yaratın', 
 '["Özel tasarım şablonları", "Logo yükleme", "Custom domain", "Öncelikli destek", "API erişimi"]',
 3, true)
ON CONFLICT DO NOTHING;

-- 3. PRICING PLANS TABLE (Dynamic pricing management)
CREATE TABLE IF NOT EXISTS pricing_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price_monthly NUMERIC(8,2),
    price_yearly NUMERIC(8,2),
    features JSONB DEFAULT '[]',
    is_popular BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pricing plans
INSERT INTO pricing_plans (name, price_monthly, price_yearly, features, is_popular, order_index, is_active) VALUES
('Ücretsiz', 0.00, 0.00, 
 '["1 dijital kartvizit", "Temel QR kod", "Sınırlı paylaşım", "Email destek"]',
 false, 1, true),
('Kişisel', 29.90, 299.00, 
 '["5 dijital kartvizit", "QR Analytics", "Sosyal medya entegrasyonu", "Özel tasarım", "Öncelikli destek"]',
 true, 2, true),
('Profesyonel', 99.90, 999.00, 
 '["Sınırsız kartvizit", "Gelişmiş analytics", "Custom domain", "Logo upload", "API erişimi", "WhatsApp destek"]',
 false, 3, true),
('Kurumsal', 299.90, 2999.00, 
 '["Tüm özellikler", "Multi-user yönetimi", "Özel entegrasyonlar", "SLA garantisi", "Özel eğitim", "Dedicated hesap yöneticisi"]',
 false, 4, true)
ON CONFLICT DO NOTHING;

-- 4. SITE POLICIES TABLE (Legal content management)
CREATE TABLE IF NOT EXISTS site_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL UNIQUE, -- 'privacy', 'terms', 'cookie', 'refund'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    version TEXT DEFAULT '1.0',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default policies
INSERT INTO site_policies (type, title, content, version) VALUES
('privacy', 'Gizlilik Politikası', 
 '# Gizlilik Politikası\n\nRavenkart olarak kullanıcılarımızın gizliliğini korumayı taahhüt ediyoruz.\n\n## Topladığımız Bilgiler\n- İsim ve iletişim bilgileri\n- Kartvizit içeriği\n- Kullanım analytics\n\n## Bilgilerin Kullanımı\nVerileriniz sadece hizmet sunumu için kullanılır.',
 '1.0'),
('terms', 'Kullanım Şartları', 
 '# Kullanım Şartları\n\nRavenkart hizmetini kullanarak aşağıdaki şartları kabul etmiş olursunuz.\n\n## Hizmet Kullanımı\n- Hizmet yasal amaçlarla kullanılmalıdır\n- Spam ve zararlı içerik yasaktır\n\n## Hesap Sorumluluğu\nHesabınızın güvenliğinden siz sorumlusunuz.',
 '1.0'),
('cookie', 'Çerez Politikası', 
 '# Çerez Politikası\n\nWeb sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanıyoruz.\n\n## Çerez Türleri\n- Zorunlu çerezler\n- Analytics çerezleri\n- Pazarlama çerezleri\n\n## Çerez Yönetimi\nTarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.',
 '1.0')
ON CONFLICT (type) DO NOTHING;

-- 5. CONTACT INFO TABLE (Contact details management)
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'email', 'phone', 'address', 'social'
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT, -- lucide icon name
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default contact info
INSERT INTO contact_info (type, label, value, icon, order_index, is_active) VALUES
('email', 'Destek E-posta', 'destek@ravenkart.com', 'mail', 1, true),
('email', 'İş Geliştirme', 'iletisim@ravenkart.com', 'briefcase', 2, true),
('phone', 'Destek Hattı', '+90 542 123 45 67', 'phone', 3, true),
('address', 'Merkez Ofis', 'İstanbul, Türkiye', 'map-pin', 4, true),
('social', 'Twitter', 'https://twitter.com/ravenkart', 'twitter', 5, true),
('social', 'LinkedIn', 'https://linkedin.com/company/ravenkart', 'linkedin', 6, true)
ON CONFLICT DO NOTHING;

-- 6. ADMIN AUDIT LOG TABLE (Track admin actions)
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    resource_type TEXT, -- 'product', 'pricing', 'policy', 'contact'
    resource_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Superadmins indexes
CREATE INDEX IF NOT EXISTS idx_superadmins_email ON superadmins(email);

-- Site products indexes
CREATE INDEX IF NOT EXISTS idx_site_products_active ON site_products(is_active);
CREATE INDEX IF NOT EXISTS idx_site_products_order ON site_products(order_index);

-- Pricing plans indexes
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active ON pricing_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_order ON pricing_plans(order_index);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_popular ON pricing_plans(is_popular);

-- Site policies indexes
CREATE INDEX IF NOT EXISTS idx_site_policies_type ON site_policies(type);
CREATE INDEX IF NOT EXISTS idx_site_policies_active ON site_policies(is_active);

-- Contact info indexes
CREATE INDEX IF NOT EXISTS idx_contact_info_type ON contact_info(type);
CREATE INDEX IF NOT EXISTS idx_contact_info_active ON contact_info(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_info_order ON contact_info(order_index);

-- Admin audit logs indexes
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_email ON admin_audit_logs(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource_type ON admin_audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS on all admin tables
ALTER TABLE superadmins ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Superadmins: Only accessible by service role
CREATE POLICY "superadmins_service_role_only" ON superadmins
    FOR ALL USING (auth.role() = 'service_role');

-- Site products: Read for everyone, write only for service role
CREATE POLICY "site_products_read_all" ON site_products
    FOR SELECT USING (is_active = true);

CREATE POLICY "site_products_admin_all" ON site_products
    FOR ALL USING (auth.role() = 'service_role');

-- Pricing plans: Read for everyone, write only for service role
CREATE POLICY "pricing_plans_read_all" ON pricing_plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "pricing_plans_admin_all" ON pricing_plans
    FOR ALL USING (auth.role() = 'service_role');

-- Site policies: Read for everyone, write only for service role
CREATE POLICY "site_policies_read_all" ON site_policies
    FOR SELECT USING (is_active = true);

CREATE POLICY "site_policies_admin_all" ON site_policies
    FOR ALL USING (auth.role() = 'service_role');

-- Contact info: Read for everyone, write only for service role
CREATE POLICY "contact_info_read_all" ON contact_info
    FOR SELECT USING (is_active = true);

CREATE POLICY "contact_info_admin_all" ON contact_info
    FOR ALL USING (auth.role() = 'service_role');

-- Admin audit logs: Only accessible by service role
CREATE POLICY "admin_audit_logs_service_role_only" ON admin_audit_logs
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to admin tables
CREATE TRIGGER update_superadmins_updated_at BEFORE UPDATE ON superadmins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_products_updated_at BEFORE UPDATE ON site_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON pricing_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_policies_updated_at BEFORE UPDATE ON site_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    admin_email TEXT,
    action TEXT,
    resource_type TEXT DEFAULT NULL,
    resource_id UUID DEFAULT NULL,
    old_data JSONB DEFAULT NULL,
    new_data JSONB DEFAULT NULL,
    ip_address TEXT DEFAULT NULL,
    user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO admin_audit_logs (
        admin_email,
        action,
        resource_type,
        resource_id,
        old_data,
        new_data,
        ip_address,
        user_agent
    ) VALUES (
        admin_email,
        action,
        resource_type,
        resource_id,
        old_data,
        new_data,
        ip_address,
        user_agent
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA VALIDATION
-- =====================================================

-- Verify superadmin was created
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM superadmins WHERE email = '1erkinyagci@gmail.com') THEN
        RAISE EXCEPTION 'Superadmin account was not created successfully';
    END IF;
    
    RAISE NOTICE 'Superadmin setup completed successfully for 1erkinyagci@gmail.com';
END
$$;