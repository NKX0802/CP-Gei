// API: GET /api/admin/users — return the user list (for the admin notification recipient dropdown)
// Admin only

import { pool } from '@/lib/db'
import { getUser } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' })
  }

  const user = await getUser(req)
  if (!user) {
    return res.status(401).json({ success: false, error: 'Not logged in.' })
  }
  if (user.user_role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required.' })
  }

  try {
    const [rows] = await pool.query(
      'SELECT user_id, user_name, user_email, user_role FROM users ORDER BY user_name'
    )
    return res.status(200).json({ success: true, data: rows })
  } catch (err) {
    console.error('GET /api/admin/users error:', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch users.' })
  }
}
