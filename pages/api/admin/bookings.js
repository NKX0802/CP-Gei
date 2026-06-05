// API: GET /api/admin/bookings — return all bookings with optional filters
//   Query params: ?date=YYYY-MM-DD&roomId=&status=
//   Join "bookings" with "users" and "rooms" for full details
//   Also used by dashboard for stats (total bookings, bookings per day for chart)
// API: PATCH /api/admin/bookings — update booking status (query: ?id=...)
//   Body: { status: "cancelled" | "no-show" | "completed" }
// Admin only — return 403 if not admin

export default async function handler(req, res) {}
