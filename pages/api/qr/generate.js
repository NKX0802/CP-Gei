// API: GET /api/qr/generate?facility_id=<id>
// Generates a QR code data URL for a given facility.
// The QR encodes the string "facility_id=<id>" which is what the scanner reads.
// No check-in logic here — this only generates the image.

import QRCode from 'qrcode'
import { pool } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'method_not_allowed', message: 'Method not allowed.' })
  }

  const { facility_id } = req.query

  // Validate facility_id
  const id = parseInt(facility_id, 10)
  if (!facility_id || isNaN(id) || id < 1) {
    return res.status(400).json({ success: false, error: 'invalid_id', message: 'A valid facility_id is required.' })
  }

  try {
    // Verify facility actually exists before generating a QR for it
    const [rows] = await pool.query(
      'SELECT facility_id, facility_name FROM facilities WHERE facility_id = ?',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'not_found', message: `Facility ${id} not found.` })
    }

    const facility = rows[0]

    // The QR value that the scanner will read
    const qrValue = `facility_id=${id}`

    // Generate QR code as a base64 data URL
    const dataUrl = await QRCode.toDataURL(qrValue, {
      width: 400,
      margin: 2,
      color: {
        dark: '#065f46',  // emerald-900 — matches project theme
        light: '#ffffff',
      },
    })

    return res.status(200).json({
      success: true,
      data: {
        facility_id: id,
        facility_name: facility.facility_name,
        qr_value: qrValue,
        qr_data_url: dataUrl,
      },
    })
  } catch (err) {
    console.error('GET /api/qr/generate error:', err)
    return res.status(500).json({ success: false, error: 'server_error', message: 'Something went wrong. Please try again.' })
  }
}
