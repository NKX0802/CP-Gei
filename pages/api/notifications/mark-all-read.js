// API: POST /api/notifications/mark-all-read — mark all of the logged-in user's notifications as read

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

  try {
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [user.user_id]
    )

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      data: { updated: result.affectedRows },
    })
  } catch (err) {
    console.error('POST /api/notifications/mark-all-read error:', err)
    return res.status(500).json({ success: false, error: 'Failed to mark notifications as read.' })
  }
}
