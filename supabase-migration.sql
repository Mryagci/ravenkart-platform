-- Cards tablosuna qr_redirect_url alanı ekle
ALTER TABLE cards ADD COLUMN IF NOT EXISTS qr_redirect_url TEXT;

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

-- Analytics tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_qr_analytics_card_id ON qr_analytics(card_id);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_scanned_at ON qr_analytics(scanned_at);

-- RLS (Row Level Security) politikaları
ALTER TABLE qr_analytics ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi kartlarının analytics verilerini görebilsin
CREATE POLICY "Users can view analytics for their own cards" ON qr_analytics
    FOR SELECT USING (
        card_id IN (
            SELECT id FROM cards WHERE user_id = auth.uid()
        )
    );

-- QR analytics verileri herkese insert edilebilir (analytics kayıt için)
CREATE POLICY "Anyone can insert QR analytics" ON qr_analytics
    FOR INSERT WITH CHECK (true);