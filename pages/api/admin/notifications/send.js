// API: POST /api/admin/notifications/send — admin sends a notification to one user or all users
// Body: { sendTo: 'single' | 'all', user_id, title, message, notification_type }
// Admin only

import { pool } from '@/lib/db'
import { getUser } from '@/lib/auth'

const VALID_TYPES = ['general', 'announcement', 'booking', 'check-in', 'no-show', 'cancelled']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' })
  }

  const admin = await getUser(req)
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Not logged in.' })
  }
  if (admin.user_role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required.' })
  }

  const { sendTo, user_id, title, message, notification_type } = req.body

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Title is required.' })
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message is required.' })
  }

  const type = notification_type && VALID_TYPES.includes(notification_type) ? notification_type : 'general'

  if (sendTo !== 'single' && sendTo !== 'all') {
    return res.status(400).json({ success: false, error: 'sendTo must be "single" or "all".' })
  }

  try {
    // ── Send to one specific user ────────────────────────────────────────────
    if (sendTo === 'single') {
      if (!user_id) {
        return res.status(400).json({ success: false, error: 'Please select a user to send to.' })
      }

      const [users] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [user_id])
      if (users.length === 0) {
        return res.status(404).json({ success: false, error: 'Selected user not found.' })
      }

      await pool.query(
        `INSERT INTO notifications (user_id, title, message, notification_type, is_read, created_by, created_at)
         VALUES (?, ?, ?, ?, 0, ?, NOW())`,
        [user_id, title.trim(), message.trim(), type, admin.user_id]
      )

      return res.status(200).json({
        success: true,
        message: 'Notification sent.',
        data: { sent: 1 },
      })
    }

    // ── Send to every normal user ────────────────────────────────────────────
    const [users] = await pool.query("SELECT user_id FROM users WHERE user_role = 'user'")
    if (users.length === 0) {
      return res.status(200).json({ success: true, message: 'No users to notify.', data: { sent: 0 } })
    }

    const values = []
    const placeholders = users.map(u => {
      values.push(u.user_id, title.trim(), message.trim(), type, admin.user_id)
      return '(?, ?, ?, ?, 0, ?, NOW())'
    }).join(', ')

    await pool.query(
      `INSERT INTO notifications (user_id, title, message, notification_type, is_read, created_by, created_at)
       VALUES ${placeholders}`,
      values
    )

    return res.status(200).json({
      success: true,
      message: `Notification sent to ${users.length} user(s).`,
      data: { sent: users.length },
    })
  } catch (err) {
    console.error('POST /api/admin/notifications/send error:', err)
    return res.status(500).json({ success: false, error: 'Failed to send notification.' })
  }
}
