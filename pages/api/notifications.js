// API: GET /api/notifications — return notifications for the logged-in user (newest first)
// Optional: ?filter=unread|read to narrow the list

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
    const { filter } = req.query
    let query = `
      SELECT notification_id, user_id, title, message, notification_type,
             is_read, created_by, created_at
      FROM notifications
      WHERE user_id = ?
    `
    const params = [user.user_id]

    if (filter === 'unread') {
      query += ' AND is_read = 0'
    } else if (filter === 'read') {
      query += ' AND is_read = 1'
    }

    query += ' ORDER BY created_at DESC'

    const [rows] = await pool.query(query, params)
    return res.status(200).json({ success: true, data: rows })
  } catch (err) {
    console.error('GET /api/notifications error:', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch notifications.' })
  }
}
