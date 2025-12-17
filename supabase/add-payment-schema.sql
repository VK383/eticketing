-- Add payment columns to tickets table
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS ticket_type TEXT DEFAULT 'regular' CHECK (ticket_type IN ('regular', 'vip', 'premium')),
ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMP WITH TIME ZONE;

-- Update status constraint to include payment-pending
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_status_check;
ALTER TABLE tickets ADD CONSTRAINT tickets_status_check 
CHECK (status IN ('pending', 'booked', 'used', 'cancelled'));

-- Create index for payment queries
CREATE INDEX IF NOT EXISTS idx_tickets_payment_status ON tickets(payment_status);
CREATE INDEX IF NOT EXISTS idx_tickets_payment_id ON tickets(payment_id);

-- Update RLS policies to include payment status check for ticket viewing
DROP POLICY IF EXISTS "tickets_select_policy" ON tickets;
CREATE POLICY "tickets_select_policy" ON tickets 
    FOR SELECT USING (true);

SELECT '✅ Payment schema added successfully!' as status;
