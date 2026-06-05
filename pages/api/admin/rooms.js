// API: GET /api/admin/rooms — return all rooms (active + inactive)
// API: POST /api/admin/rooms — create a new room
//   Body: { name, capacity, location, type, facilities, description }
//   Inserts into "rooms" table with status = "active"
// API: PUT /api/admin/rooms — update a room (query: ?id=...)
// API: DELETE /api/admin/rooms — deactivate a room (query: ?id=...) sets status = "inactive"
// Admin only — return 403 if not admin

export default async function handler(req, res) {}
