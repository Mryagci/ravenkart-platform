-- ADD order_id COLUMN TO PAYMENTS TABLE IF MISSING

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'order_id'
    ) THEN
        ALTER TABLE payments ADD COLUMN order_id TEXT UNIQUE NOT NULL;
        RAISE NOTICE 'order_id column added to payments table';
    ELSE
        RAISE NOTICE 'order_id column already exists in payments table';
    END IF;
END $$;

-- Now create index safely
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

SELECT 'order_id column checked and index created' as status;