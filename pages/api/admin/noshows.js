// API: GET /api/admin/noshows — return all bookings where student did not check in
// Query "bookings" table where status = "no-show"
// Join with "users" and "rooms" for full details
// Group by user to count repeat no-shows per student
// Admin only — return 403 if not admin

export default async function handler(req, res) {}
