// API: POST /api/upload — receive a base64-encoded image, store it on Vercel Blob
// Returns: { success: true, url: 'https://<store>.public.blob.vercel-storage.com/facilities/...' }
// Admin only
//
// Vercel's serverless functions have a read-only filesystem, so images can't be
// written to /public at runtime — Vercel Blob gives each upload a permanent public URL instead.
// Requires BLOB_READ_WRITE_TOKEN (auto-set by Vercel when a Blob store is connected to
// the project; for local dev, copy it from Vercel → Storage → your Blob store → .env.local tab).

import { put } from '@vercel/blob'
import { getUser } from '@/lib/auth'

// Increase body size limit to allow image uploads (up to 8 MB base64)
export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' })
  }

  const admin = await getUser(req)
  if (!admin) return res.status(401).json({ success: false, error: 'Not logged in.' })
  if (admin.user_role !== 'admin') return res.status(403).json({ success: false, error: 'Admin access required.' })

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({
      success: false,
      error: 'Image storage is not configured. Set BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob store → .env.local tab) and restart the server.',
    })
  }

  const { image, filename } = req.body || {}
  if (!image || !filename) {
    return res.status(400).json({ success: false, error: 'Image data and filename are required.' })
  }

  // Validate base64 data URL
  const matches = image.match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,(.+)$/)
  if (!matches) {
    return res.status(400).json({ success: false, error: 'Invalid image format. Use JPEG, PNG, WEBP, or GIF.' })
  }

  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, 'base64')

  // Reject oversized images (5 MB decoded)
  if (buffer.byteLength > 5 * 1024 * 1024) {
    return res.status(400).json({ success: false, error: 'Image must be under 5 MB.' })
  }

  // Build a safe, unique filename
  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  try {
    const blob = await put(`facilities/${safeName}`, buffer, {
      access: 'public',
      contentType: `image/${matches[1]}`,
    })
    return res.status(200).json({ success: true, url: blob.url })
  } catch (err) {
    console.error('POST /api/upload error:', err)
    return res.status(500).json({ success: false, error: 'Failed to save image.' })
  }
}
