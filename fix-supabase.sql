-- COMPLETE Supabase Setup Script for E-Ticketing
-- Run this entire script in your Supabase SQL Editor (supabase.com → SQL Editor)

-- ================================================
-- STEP 1: Create the tickets table (if not exists)
-- ================================================
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    user_email TEXT,
    event_date DATE NOT NULL,
    ticket_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'used', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- STEP 2: Enable Row Level Security (required)
-- ================================================
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- ================================================
-- STEP 3: Drop any existing policies (clean slate)
-- ================================================
DROP POLICY IF EXISTS "Enable read for everyone" ON tickets;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON tickets;
DROP POLICY IF EXISTS "Enable insert for everyone" ON tickets;
DROP POLICY IF EXISTS "Enable update for everyone" ON tickets;
DROP POLICY IF EXISTS "Allow all select" ON tickets;
DROP POLICY IF EXISTS "Allow all insert" ON tickets;
DROP POLICY IF EXISTS "Allow all update" ON tickets;

-- ================================================
-- STEP 4: Create permissive policies for public access
-- ================================================
CREATE POLICY "tickets_select_policy" ON tickets 
    FOR SELECT USING (true);

CREATE POLICY "tickets_insert_policy" ON tickets 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "tickets_update_policy" ON tickets 
    FOR UPDATE USING (true);

-- ================================================
-- STEP 5: Create index for faster lookups
-- ================================================
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_date ON tickets(event_date);

-- ================================================
-- VERIFICATION: Check if setup is correct
-- ================================================
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'tickets';

SELECT 
    policyname, 
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'tickets';

SELECT '✅ Setup complete! Your tickets table is ready.' as status;
