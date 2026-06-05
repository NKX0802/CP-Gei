// API: POST /api/login
// Accept: { email, password }
// Look up user in "users" table by email
// Compare password using bcryptjs
// On success: create a JWT with jose, set it as an httpOnly cookie, return user info + role
// On failure: return 401 Unauthorized

export default async function handler(req, res) {}
