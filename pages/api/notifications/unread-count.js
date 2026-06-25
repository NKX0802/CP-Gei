// API: GET /api/notifications/unread-count — number of unread notifications for the logged-in user

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

  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = 0',
      [user.user_id]
    )

    return res.status(200).json({ success: true, data: { unread: rows[0].unread } })
  } catch (err) {
    console.error('GET /api/notifications/unread-count error:', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch unread count.' })
  }
}
