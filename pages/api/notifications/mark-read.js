// API: POST /api/notifications/mark-read — mark one of the logged-in user's own notifications as read
// Body: { notification_id }

import { pool } from '@/lib/db'
import { getUser } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' })
  }

  const user = await getUser(req)
  if (!user) {
    return res.status(401).json({ success: false, error: 'Not logged in.' })
  }

  const { notification_id } = req.body
  if (!notification_id) {
    return res.status(400).json({ success: false, error: 'notification_id is required.' })
  }

  try {
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?',
      [notification_id, user.user_id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Notification not found.' })
    }

    return res.status(200).json({ success: true, message: 'Notification marked as read.' })
  } catch (err) {
    console.error('POST /api/notifications/mark-read error:', err)
    return res.status(500).json({ success: false, error: 'Failed to mark notification as read.' })
  }
}
