// API: GET /api/admin/notifications — list notifications sent by admins (grouped per "send" action)
// API: DELETE /api/admin/notifications — retract a previously sent notification (all its recipient rows)
//   Body: { title, message, notification_type, created_by, created_at }
// Admin only

import { pool } from '@/lib/db'
import { getUser } from '@/lib/auth'

export default async function handler(req, res) {
  const admin = await getUser(req)
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Not logged in.' })
  }
  if (admin.user_role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required.' })
  }

  // ── GET — sent history, one row per "send" action (grouped across recipients) ──
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(`
        SELECT n.title, n.message, n.notification_type, n.created_by,
               DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
               COUNT(*) AS recipient_count,
               ANY_VALUE(n.user_id) AS sample_user_id,
               ANY_VALUE(ru.user_name) AS sample_user_name,
               ANY_VALUE(cu.user_name) AS creator_name
        FROM notifications n
        LEFT JOIN users ru ON ru.user_id = n.user_id
        LEFT JOIN users cu ON cu.user_id = n.created_by
        WHERE n.created_by IS NOT NULL
        GROUP BY n.title, n.message, n.notification_type, n.created_by,
                 DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i:%s')
        ORDER BY MAX(n.created_at) DESC
        LIMIT 100
      `)
      return res.status(200).json({ success: true, data: rows })
    } catch (err) {
      console.error('GET /api/admin/notifications error:', err)
      return res.status(500).json({ success: false, error: 'Failed to fetch sent notifications.' })
    }
  }

  // ── DELETE — retract a sent notification (removes it for every recipient) ──────
  if (req.method === 'DELETE') {
    const { title, message, notification_type, created_by, created_at } = req.body

    if (!title || !message || !notification_type || !created_by || !created_at) {
      return res.status(400).json({ success: false, error: 'Missing fields required to identify the notification.' })
    }

    try {
      const [result] = await pool.query(
        `DELETE FROM notifications
         WHERE title = ? AND message = ? AND notification_type = ? AND created_by = ? AND created_at = ?`,
        [title, message, notification_type, created_by, created_at]
      )
      return res.status(200).json({
        success: true,
        message: 'Notification deleted.',
        data: { deleted: result.affectedRows },
      })
    } catch (err) {
      console.error('DELETE /api/admin/notifications error:', err)
      return res.status(500).json({ success: false, error: 'Failed to delete notification.' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
