// API: POST /api/book
// Accept: { roomId, date, startTime, endTime, purpose }
// Check the time slot is not already booked (query "bookings" table)
// Insert new booking with status = "confirmed"
// Generate a unique QR code string (e.g. UUID) and save it with the booking
// Return the new booking ID and QR code string

export default async function handler(req, res) {}
