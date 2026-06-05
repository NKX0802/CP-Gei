// API: POST /api/checkin
// Accept: { bookingId } decoded from the scanned QR code
// Look up booking in "bookings" table
// Verify: booking belongs to logged-in student, status is "confirmed", time is now
// Update status to "checked-in", record check-in timestamp
// Return success or descriptive error message

export default async function handler(req, res) {}
