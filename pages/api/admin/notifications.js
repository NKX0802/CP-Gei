// API: POST /api/admin/notifications — send a notification to a student or all students
//   Body: { recipientId: "all" | userId, subject, message }
//   If recipientId is "all", insert a row for every student in "users" table
//   Insert into "notifications" table
// API: GET /api/admin/notifications — return list of recently sent notifications
// Admin only — return 403 if not admin

export default async function handler(req, res) {}
