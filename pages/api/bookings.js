// API: GET /api/bookings — return all bookings for the logged-in student
// Join "bookings" with "rooms" table to include room name and location
// Support filter: ?status=confirmed|cancelled|completed|no-show
// API: DELETE /api/bookings — cancel a booking (query: ?id=...)
// Only allow cancel if booking belongs to the logged-in student and hasn't started
// Return 401 if not authenticated

export default async function handler(req, res) {}
