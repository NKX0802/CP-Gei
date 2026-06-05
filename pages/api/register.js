// API: POST /api/register
// Accept: { name, studentId, email, password }
// Validate: no duplicate email, password length
// Hash password with bcryptjs before saving
// Insert into "users" table with role = "student"
// Return 201 on success, 400 on validation error

export default async function handler(req, res) {}
