// API: GET /api/bookings/qr?id=<booking_id>
// Returns a QR code data URL for the user's own 'booked' booking.
// Generates a unique checkin_token and saves it to the booking if not already set.
// The QR encodes:  checkin_token=<token>
// (Requires the bookings table to have a checkin_token VARCHAR(255) NULL column.)

import QRCode from 'qrcode'
import { pool } from '@/lib/db'
import { getUser } from '@/lib/auth'
import { randomUUID } from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'method_not_allowed', message: 'Method not allowed.' })
  }

  // 1. Auth — must be logged in
  const user = await getUser(req)
  if (!user) {
    return res.status(401).json({ success: false, error: 'unauthorized', message: 'Please log in first.' })
  }

  // 2. Validate booking_id from query
  const bookingId = parseInt(req.query.id, 10)
  if (!req.query.id || isNaN(bookingId) || bookingId < 1) {
    return res.status(400).json({ success: false, error: 'invalid_id', message: 'A valid booking ID is required.' })
  }

  try {
    // 3. Fetch the booking — must belong to this user
    const [rows] = await pool.query(
      `SELECT
         b.booking_id, b.user_id, b.booking_status,
         b.booking_date, b.booking_time_slot, b.booking_group_size,
         b.checkin_token,
         f.facility_name, f.facility_type
       FROM bookings b
       JOIN facilities f ON f.facility_id = b.facility_id
       WHERE b.booking_id = ? AND b.user_id = ?`,
      [bookingId, user.user_id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'not_found', message: 'Booking not found.' })
    }

    const booking = rows[0]

    // 4. Only generate QR for active 'booked' bookings
    if (booking.booking_status !== 'booked') {
      const statusMessages = {
        'checked-in': 'This booking has already been checked in.',
        'no-show':    'This booking has been marked as no-show.',
        'cancelled':  'This booking has been cancelled.',
      }
      return res.status(400).json({
        success: false,
        error: 'invalid_status',
        message: statusMessages[booking.booking_status] || 'QR code is only available for active bookings.',
      })
    }

    // 5. Generate a checkin_token if not already saved, then persist it
    let token = booking.checkin_token
    if (!token) {
      token = randomUUID()
      await pool.query(
        'UPDATE bookings SET checkin_token = ? WHERE booking_id = ?',
        [token, bookingId]
      )
    }

    // 6. Build the QR value and generate the QR image
    const qrValue = `checkin_token=${token}`

    const qrDataUrl = await QRCode.toDataURL(qrValue, {
      width: 360,
      margin: 2,
      color: {
        dark: '#065f46',   // emerald-900 — matches project theme
        light: '#ffffff',
      },
    })

    return res.status(200).json({
      success: true,
      data: {
        qr_data_url: qrDataUrl,
        qr_value: qrValue,
        facility_name:    booking.facility_name,
        facility_type:    booking.facility_type,
        booking_date:     booking.booking_date,
        booking_time_slot: booking.booking_time_slot,
        booking_status:   booking.booking_status,
      },
    })
  } catch (err) {
    console.error('GET /api/bookings/qr error:', err)
    return res.status(500).json({ success: false, error: 'server_error', message: 'Something went wrong. Please try again.' })
  }
}
