-- Önce users tablosunun var olup olmadığını kontrol edelim
-- Eğer yoksa oluşturalım (genelde Supabase auth otomatik oluşturur)

-- Cards tablosu oluştur
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

-- QR Analytics tablosu oluştur
CREATE TABLE IF NOT EXISTS qr_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_username ON cards(username);
CREATE INDEX IF NOT EXISTS idx_cards_is_active ON cards(is_active);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_card_id ON qr_analytics(card_id);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_scanned_at ON qr_analytics(scanned_at);

-- RLS (Row Level Security) politikaları
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_analytics ENABLE ROW LEVEL SECURITY;

-- Cards tablosu için RLS politikaları
CREATE POLICY "Users can view their own cards" ON cards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards" ON cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" ON cards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" ON cards
    FOR DELETE USING (auth.uid() = user_id);

-- Public cards görüntüleme politikası (username ile erişim için)
CREATE POLICY "Anyone can view active cards by username" ON cards
    FOR SELECT USING (is_active = true);

-- QR Analytics için RLS politikaları
CREATE POLICY "Users can view analytics for their own cards" ON qr_analytics
    FOR SELECT USING (
        card_id IN (
            SELECT id FROM cards WHERE user_id = auth.uid()
        )
    );

-- QR analytics verileri herkese insert edilebilir (analytics kayıt için)
CREATE POLICY "Anyone can insert QR analytics" ON qr_analytics
    FOR INSERT WITH CHECK (true);

-- Trigger fonksiyonu: updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated_at trigger'ı ekle
DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at 
    BEFORE UPDATE ON cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Username unique constraint ve otomatik username oluşturma fonksiyonu
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