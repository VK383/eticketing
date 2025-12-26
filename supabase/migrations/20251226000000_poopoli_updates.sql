-- Migration: Update capacity to 1 lakh and seed Poopoli 2026 dates
-- Date: 2025-12-26

-- Update default capacity in event_dates table
ALTER TABLE event_dates 
ALTER COLUMN capacity SET DEFAULT 100000;

-- Insert Poopoli 2026 dates (January 1-15, 2026) with 1 lakh capacity
-- If dates already exist, only update capacity (preserve existing bookings)
INSERT INTO event_dates (event_date, capacity, booked) VALUES
('2026-01-01', 100000, 0),
('2026-01-02', 100000, 0),
('2026-01-03', 100000, 0),
('2026-01-04', 100000, 0),
('2026-01-05', 100000, 0),
('2026-01-06', 100000, 0),
('2026-01-07', 100000, 0),
('2026-01-08', 100000, 0),
('2026-01-09', 100000, 0),
('2026-01-10', 100000, 0),
('2026-01-11', 100000, 0),
('2026-01-12', 100000, 0),
('2026-01-13', 100000, 0),
('2026-01-14', 100000, 0),
('2026-01-15', 100000, 0)
ON CONFLICT (event_date) 
DO UPDATE SET capacity = 100000;
