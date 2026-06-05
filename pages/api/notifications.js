// API: GET /api/notifications — return notifications for the logged-in student (newest first)
// API: PATCH /api/notifications — mark a notification as read (query: ?id=...)
// Query "notifications" table filtered by user_id from JWT
// Return 401 if not authenticated

export default async function handler(req, res) {}
