-- PHASE 2: RLS POLICIES
-- Run this AFTER Phase 1 and AFTER setting up auth

-- 1. ENABLE ROW LEVEL SECURITY
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. RLS POLICIES FOR CARDS
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

-- 3. RLS POLICIES FOR QR ANALYTICS
CREATE POLICY "Users can view analytics for their own cards" ON qr_analytics
    FOR SELECT USING (
        card_id IN (
            SELECT id FROM cards WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert QR analytics" ON qr_analytics
    FOR INSERT WITH CHECK (true);

-- 4. RLS POLICIES FOR PAYMENTS
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payments" ON payments
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 5. RLS POLICIES FOR SUBSCRIPTIONS
CREATE POLICY "Users can view their own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- VERIFICATION
SELECT 'Phase 2 completed - RLS policies created successfully' as status;