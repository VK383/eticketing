-- Migration: Add group booking and scan tracking features
-- Date: 2025-12-26

-- Add columns for group booking and scan tracking
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS attendee_count INT NOT NULL DEFAULT 1 CHECK (attendee_count >= 1 AND attendee_count <= 50),
ADD COLUMN IF NOT EXISTS scan_count INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_scanned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_scanned_at TIMESTAMP WITH TIME ZONE;

-- Create index for scan tracking queries
CREATE INDEX IF NOT EXISTS idx_tickets_scan_count ON tickets(scan_count);
CREATE INDEX IF NOT EXISTS idx_tickets_first_scanned_at ON tickets(first_scanned_at);

-- Update the ticket status to track scanned state more accurately
-- Status can be: pending, booked, used, cancelled
-- scan_count tracks how many times QR was scanned

COMMENT ON COLUMN tickets.attendee_count IS 'Number of people on this ticket (group booking)';
COMMENT ON COLUMN tickets.scan_count IS 'Number of times this ticket QR code was scanned';
COMMENT ON COLUMN tickets.first_scanned_at IS 'Timestamp of first successful scan';
COMMENT ON COLUMN tickets.last_scanned_at IS 'Timestamp of most recent scan';
