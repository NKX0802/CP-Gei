import { useState, useRef } from 'react'
import Link from 'next/link'
import { QrCode, Download, ArrowLeft, Search, Loader2, AlertCircle } from 'lucide-react'
import { useRole } from '@/lib/roleContext'

export default function FacilityQRPage() {
  const { user, loading: authLoading } = useRole()

  const [facilityId, setFacilityId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)   // { facility_name, qr_value, qr_data_url }
  const [error, setError] = useState(null)
  const imgRef = useRef(null)

  async function handleGenerate(e) {
    e.preventDefault()
    const id = facilityId.trim()
    if (!id) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/qr/generate?facility_id=${encodeURIComponent(id)}`)
      const data = await res.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.message || 'Could not generate QR code.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    if (!result?.qr_data_url) return
    const a = document.createElement('a')
    a.href = result.qr_data_url
    a.download = `facility-qr-${result.facility_id || facilityId}.png`
    a.click()
  }

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-green-50 pt-16 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 pt-16 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-sm w-full mx-4">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Access Denied
          </h2>
          <p className="text-sm text-gray-500 mb-5">You must be logged in to access this page.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 pt-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-emerald-700 transition-colors mb-5 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Facility QR Generator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate a QR code for a facility. Print and place it at the entrance.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <form onSubmit={handleGenerate} className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="facility-id-input" className="block text-xs font-semibold text-gray-500 mb-1.5">
                Facility ID
              </label>
              <input
                id="facility-id-input"
                type="number"
                min="1"
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                placeholder="e.g. 1"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !facilityId.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 hover:scale-105 active:scale-95 will-change-transform"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                {loading ? 'Generating…' : 'Generate'}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* QR Result */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center animate-in fade-in">

            {/* Facility info */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                <QrCode size={12} />
                Facility #{result.facility_id}
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {result.facility_name}
              </h2>
            </div>

            {/* QR image */}
            <div className="inline-block p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={result.qr_data_url}
                alt={`QR code for ${result.facility_name}`}
                className="w-52 h-52 mx-auto"
              />
            </div>

            {/* QR value label */}
            <div className="mb-5">
              <p className="text-xs text-gray-400 mb-1">QR encodes:</p>
              <code className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-mono rounded-lg">
                {result.qr_value}
              </code>
            </div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95 will-change-transform focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm"
            >
              <Download size={16} />
              Download QR Image
            </button>

            <p className="text-xs text-gray-400 mt-3">
              Print this QR code and place it at the facility entrance.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
