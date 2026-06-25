// API: POST /api/checkin/verify
// Accepts a scanned QR value containing facility_id
// Checks if the logged-in student has an active booking for this facility today
// Applies the 15-minute check-in grace period

import { pool } from '@/lib/db'
import { getUser } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'method_not_allowed', message: 'Method not allowed' })
  }

  // 1. Authenticate user
  const user = await getUser(req)
  if (!user) {
    return res.status(401).json({ success: false, error: 'unauthorized', message: 'You must be logged in.' })
  }

  // 2. Read scanned QR code value from request body
  const { qrValue } = req.body
  if (!qrValue) {
    return res.status(400).json({ success: false, error: 'invalid_qr', message: 'Invalid QR code.' })
  }

  // 3. Parse facility_id from qrValue (support facility_id=X or plain X)
  let facilityId = null
  const strVal = String(qrValue).trim()
  if (/^\d+$/.test(strVal)) {
    facilityId = parseInt(strVal, 10)
  } else if (strVal.includes('facility_id=')) {
    const match = strVal.match(/facility_id=(\d+)/)
    if (match) {
      facilityId = parseInt(match[1], 10)
    }
  }

  if (!facilityId || isNaN(facilityId)) {
    return res.status(400).json({ success: false, error: 'invalid_qr', message: 'Invalid QR code.' })
  }

  try {
    // 4. Get current time in Malaysia timezone (UTC+8) for "today" date matching
    const now = new Date()
    const mytTime = new Date(now.getTime() + (8 * 60 * 60 * 1000))
    const todayStr = mytTime.toISOString().split('T')[0] // YYYY-MM-DD

    // 5. Query user's bookings for this facility today
    const [bookings] = await pool.query(
      `SELECT booking_id, booking_date, booking_time_slot, booking_status, checked_in_at, no_show_marked_at
       FROM bookings
       WHERE user_id = ? AND facility_id = ? AND booking_date = ?`,
      [user.user_id, facilityId, todayStr]
    )

    if (bookings.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'no_booking',
        message: 'No valid booking found for this facility today.',
      })
    }

    // 6. Normalize date comparison & compute diff in minutes from booking start time
    const bookingsWithDiff = bookings.map(b => {
      let dateStr = todayStr
      if (b.booking_date) {
        if (b.booking_date instanceof Date) {
          dateStr = b.booking_date.toISOString().split('T')[0]
        } else {
          dateStr = String(b.booking_date).split('T')[0]
        }
      }

      // Slot is like "10:00-11:00", split to get start time "10:00"
      const slotStart = b.booking_time_slot.split('-')[0]
      const [hourStr, minStr] = slotStart.split(':')
      const hour = parseInt(hourStr, 10)
      const min = parseInt(minStr, 10)

      // Create UTC Date representing the local time, then adjust to actual UTC timestamp
      const bookingDateParts = dateStr.split('-')
      const bookingStartMYT = new Date(Date.UTC(
        parseInt(bookingDateParts[0], 10),
        parseInt(bookingDateParts[1], 10) - 1,
        parseInt(bookingDateParts[2], 10),
        hour,
        min,
        0
      ))
      const actualBookingStartUTC = new Date(bookingStartMYT.getTime() - (8 * 60 * 60 * 1000))

      // Diff in minutes (positive means current time is after start time, negative means before)
      const diffMins = (now.getTime() - actualBookingStartUTC.getTime()) / (60 * 1000)

      return {
        ...b,
        diffMins,
      }
    })

    // 7. Update late 'booked' bookings to 'no-show' in the DB
    let newlyMarkedNoShow = false
    for (const b of bookingsWithDiff) {
      if (b.booking_status === 'booked' && b.diffMins > 15) {
        await pool.query(
          `UPDATE bookings
           SET booking_status = 'no-show', no_show_marked_at = NOW()
           WHERE booking_id = ?`,
          [b.booking_id]
        )
        b.booking_status = 'no-show'
        newlyMarkedNoShow = true
      }
    }

    // 8. Find booking matches
    // A: Look for active booking in 15 minute checkin window
    const activeBooking = bookingsWithDiff.find(
      b => b.booking_status === 'booked' && b.diffMins >= 0 && b.diffMins <= 15
    )

    if (activeBooking) {
      await pool.query(
        `UPDATE bookings
         SET booking_status = 'checked-in', checked_in_at = NOW()
         WHERE booking_id = ?`,
        [activeBooking.booking_id]
      )
      return res.status(200).json({ success: true, message: 'Check-in successful.' })
    }

    // B: Look if already checked in
    const checkedInBooking = bookingsWithDiff.find(b => b.booking_status === 'checked-in')
    if (checkedInBooking) {
      return res.status(400).json({
        success: false,
        error: 'already_checked_in',
        message: 'This booking has already been checked in.',
      })
    }

    // C: Look if too early (future booking today)
    const earlyBooking = bookingsWithDiff.find(b => b.booking_status === 'booked' && b.diffMins < 0)
    if (earlyBooking) {
      return res.status(400).json({
        success: false,
        error: 'too_early',
        message: 'Too early to check in. Please check in when your booking time starts.',
      })
    }

    // D: Was it just marked as no-show?
    if (newlyMarkedNoShow) {
      return res.status(400).json({
        success: false,
        error: 'no_show_late',
        message: 'You are more than 15 minutes late. This booking has been marked as no-show.',
      })
    }

    // E: Was it already marked as no-show?
    const noShowBooking = bookingsWithDiff.find(b => b.booking_status === 'no-show')
    if (noShowBooking) {
      return res.status(400).json({
        success: false,
        error: 'already_no_show',
        message: 'This booking has already been marked as no-show.',
      })
    }

    // F: Was it cancelled?
    const cancelledBooking = bookingsWithDiff.find(b => b.booking_status === 'cancelled')
    if (cancelledBooking) {
      return res.status(400).json({
        success: false,
        error: 'cancelled',
        message: 'This booking has been cancelled.',
      })
    }

    // G: Fallback
    return res.status(400).json({
      success: false,
      error: 'no_booking',
      message: 'No valid booking found for this facility today.',
    })

  } catch (err) {
    console.error('Check-in verification error:', err)
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Something went wrong. Please try again.',
    })
  }
}
