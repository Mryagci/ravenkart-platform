-- CHECK AND ADD user_id COLUMN IF MISSING

-- Check if user_id column exists in cards table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE cards ADD COLUMN user_id UUID;
        RAISE NOTICE 'user_id column added to cards table';
    ELSE
        RAISE NOTICE 'user_id column already exists in cards table';
    END IF;
END $$;

-- Check if user_id column exists in payments table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE payments ADD COLUMN user_id UUID;
        RAISE NOTICE 'user_id column added to payments table';
    ELSE
        RAISE NOTICE 'user_id column already exists in payments table';
    END IF;
END $$;

-- Check if user_id column exists in subscriptions table  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN user_id UUID UNIQUE;
        RAISE NOTICE 'user_id column added to subscriptions table';
    ELSE
        RAISE NOTICE 'user_id column already exists in subscriptions table';
    END IF;
END $$;

-- Now create indexes safely
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

SELECT 'user_id columns checked and indexes created' as status;