-- Migration: Add check-in and no-show timestamps to the bookings table
ALTER TABLE bookings
ADD COLUMN checked_in_at DATETIME NULL,
ADD COLUMN no_show_marked_at DATETIME NULL;
