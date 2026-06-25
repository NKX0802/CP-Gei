import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plus, Calendar, AlertTriangle, X, Loader2,
  Clock, CheckCircle2, XCircle, QrCode, Eye,
} from 'lucide-react'
import BookingCard from '@/components/BookingCard'
import StatusBadge from '@/components/StatusBadge'
import toast from 'react-hot-toast'

const TABS = [
  { key: 'booked', label: 'Upcoming', statuses: ['booked'] },
  { key: 'completed', label: 'Completed', statuses: ['checked-in'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['no-show', 'cancelled'] },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(dtStr) {
  if (!dtStr) return null
  const d = new Date(dtStr)
  return d.toLocaleString('en-MY', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

function getCheckinWindow(timeSlot) {
  if (!timeSlot) return null
  const start = timeSlot.split('-')[0]?.trim()
  if (!start) return null
  const [hourStr, minStr] = start.split(':')
  const hour = parseInt(hourStr, 10)
  const min = parseInt(minStr, 10)
  if (isNaN(hour) || isNaN(min)) return null
  const endTotalMin = hour * 60 + min + 15
  const endHour = Math.floor(endTotalMin / 60) % 24
  const endMin = endTotalMin % 60
  function fmt(h, m) {
    const suffix = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`
  }
  return `${fmt(hour, min)} – ${fmt(endHour, endMin)}`
}

// ── Detail row helper for the modal ──────────────────────────────────────────

function DetailRow({ label, value, highlight }) {
  if (!value) return null
  return (
    <div className="flex gap-2 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 w-32 shrink-0">{label}</span>
      <span className={`text-xs ${highlight || 'text-gray-700'} font-medium`}>{value}</span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('booked')
  const [bookings, setBookings] = useState([])
  const [favCount, setFavCount] = useState(0)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cancel modal state
  const [cancelConfirmId, setCancelConfirmId] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  // View-details modal state
  const [detailBooking, setDetailBooking] = useState(null)

  // QR modal state
  const [qrBooking, setQrBooking] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [qrError, setQrError] = useState(null)

  const cancelTarget = bookings.find(b => b.booking_id === cancelConfirmId)

  // ── Data fetch ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const meRes = await fetch('/api/me')
      if (!meRes.ok) {
        setError('You must be logged in to view your dashboard.')
        setLoading(false)
        return
      }
      const meData = await meRes.json()
      if (!meData.success) {
        setError('You must be logged in to view your dashboard.')
        setLoading(false)
        return
      }
      setUser(meData.data)

      const [bookingsRes, favsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/favourites'),
      ])

      const bookingsData = await bookingsRes.json()
      const favsData = await favsRes.json()

      if (bookingsData.success) setBookings(bookingsData.data)
      if (favsData.success) setFavCount(favsData.data.length)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Fetch QR Code details when qrBooking is selected
  useEffect(() => {
    if (!qrBooking) {
      setQrData(null)
      setQrError(null)
      return
    }

    let active = true
    async function loadQR() {
      setQrLoading(true)
      setQrError(null)
      try {
        const res = await fetch(`/api/bookings/qr?id=${qrBooking.booking_id}`)
        const data = await res.json()
        if (!active) return
        if (data.success) {
          setQrData(data.data)
        } else {
          setQrError(data.message || 'Failed to generate QR code.')
        }
      } catch (err) {
        if (active) {
          setQrError('Failed to load QR code. Please try again.')
        }
      } finally {
        if (active) {
          setQrLoading(false)
        }
      }
    }

    loadQR()
    return () => {
      active = false
    }
  }, [qrBooking])

  // ── Cancel flow ────────────────────────────────────────────────────────────
  function requestCancel(id) { setCancelConfirmId(id) }

  async function confirmCancel() {
    if (!cancelConfirmId) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/bookings?id=${cancelConfirmId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setBookings(prev =>
          prev.map(b =>
            b.booking_id === cancelConfirmId
              ? { ...b, booking_status: 'cancelled', booking_cancel_reason: 'Cancelled by user' }
              : b
          )
        )
        toast('Booking cancelled successfully.', { icon: '🚫' })
      } else {
        toast.error(data.error || 'Failed to cancel booking.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setCancelling(false)
      setCancelConfirmId(null)
    }
  }

  // ── Computed values ────────────────────────────────────────────────────────
  const upcomingCount = bookings.filter(b => b.booking_status === 'booked').length
  const activeStatuses = TABS.find(t => t.key === activeTab)?.statuses ?? []
  const filtered = bookings.filter(b => activeStatuses.includes(b.booking_status))

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 pt-16 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  // ── Error / not logged in ──────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-green-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-green-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-gray-900"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Dashboard
            </h1>
            {user && (
              <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user.user_name} 👋</p>
            )}
            <p className="text-sm text-gray-400 mt-1">
              {upcomingCount > 0
                ? `${upcomingCount} upcoming ${upcomingCount === 1 ? 'booking' : 'bookings'}`
                : 'No upcoming bookings'}
              {favCount > 0 && ` · ${favCount} saved ${favCount === 1 ? 'favourite' : 'favourites'}`}
            </p>
          </div>
          <Link
            href="/facilities"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
          >
            <Plus size={15} /> Add Booking
          </Link>
        </div>

        {/* ── Section title ── */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-emerald-600" />
          <h2
            className="text-base font-bold text-gray-800"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            My Booking Status
          </h2>
        </div>

        {/* ── Status tabs ── */}
        <div className="flex gap-2 mb-5">
          {TABS.map(tab => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${activeTab === tab.key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
                }`}
            >
              {tab.label}
              {tab.key === 'booked' && upcomingCount > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'booked' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                  {upcomingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Booking cards ── */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(booking => (
              <BookingCard
                key={booking.booking_id}
                booking={booking}
                onCancel={requestCancel}
                onViewDetails={setDetailBooking}
                onQRCheckin={setQrBooking}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Calendar size={24} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">No bookings here</p>
            {activeTab === 'booked' && (
              <>
                <p className="text-xs text-gray-400 mb-5">Start by browsing available facilities.</p>
                <Link
                  href="/facilities"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Plus size={15} /> Browse Facilities
                </Link>
              </>
            )}
            {activeTab === 'completed' && (
              <p className="text-xs text-gray-400">You have no completed check-ins yet.</p>
            )}
            {activeTab === 'cancelled' && (
              <p className="text-xs text-gray-400">No cancelled or no-show bookings.</p>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          VIEW DETAILS MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDetailBooking(null)}
          />

          {/* Modal card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Eye size={15} className="text-emerald-600" />
                </div>
                <h3
                  className="font-bold text-gray-900 text-sm"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Booking Details
                </h3>
              </div>
              <button
                onClick={() => setDetailBooking(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-4">
              {/* Status badge */}
              <div className="flex justify-center mb-4">
                <StatusBadge status={detailBooking.booking_status} />
              </div>

              {/* Facility name */}
              <p
                className="text-center font-bold text-gray-900 text-base mb-4"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {detailBooking.facility_name}
              </p>

              {/* Detail rows */}
              <div className="bg-gray-50 rounded-xl px-4 py-1 mb-4">
                <DetailRow label="Booking ID" value={`#${detailBooking.booking_id}`} />
                <DetailRow label="Facility Type" value={detailBooking.facility_type ? detailBooking.facility_type.charAt(0).toUpperCase() + detailBooking.facility_type.slice(1) : null} />
                <DetailRow label="Description" value={detailBooking.facility_description} />
                <DetailRow label="Date" value={formatDate(detailBooking.booking_date)} />
                <DetailRow label="Time Slot" value={detailBooking.booking_time_slot} />
                <DetailRow label="Group Size" value={`${detailBooking.booking_group_size} ${detailBooking.booking_group_size === 1 ? 'person' : 'people'}`} />
                <DetailRow
                  label="Check-in Window"
                  value={getCheckinWindow(detailBooking.booking_time_slot)}
                  highlight="text-emerald-700"
                />
                {detailBooking.booking_status === 'checked-in' && detailBooking.checked_in_at && (
                  <DetailRow
                    label="Checked In At"
                    value={formatDateTime(detailBooking.checked_in_at)}
                    highlight="text-emerald-700"
                  />
                )}
                {detailBooking.booking_status === 'no-show' && detailBooking.no_show_marked_at && (
                  <DetailRow
                    label="No-Show Marked"
                    value={formatDateTime(detailBooking.no_show_marked_at)}
                    highlight="text-red-600"
                  />
                )}
                {detailBooking.booking_cancel_reason && (
                  <DetailRow label="Cancel Reason" value={detailBooking.booking_cancel_reason} />
                )}
              </div>

              {/* CTA buttons inside modal */}
              <div className="flex gap-2">
                {detailBooking.booking_status === 'booked' && (
                  <button
                    onClick={() => {
                      setQrBooking(detailBooking)
                      setDetailBooking(null)
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <QrCode size={14} /> QR Check-In
                  </button>
                )}
                <button
                  onClick={() => setDetailBooking(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          CANCEL CONFIRMATION MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      {cancelConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCancelConfirmId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3
                  className="font-bold text-gray-900 text-base"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Cancel booking?
                </h3>
                {cancelTarget && (
                  <p className="text-sm text-gray-500 mt-1">
                    {cancelTarget.facility_name} · {cancelTarget.booking_time_slot}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setCancelConfirmId(null)}
                className="ml-auto p-1 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                id="confirm-cancel-btn"
                onClick={confirmCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {cancelling ? 'Cancelling…' : 'Yes, cancel it'}
              </button>
              <button
                onClick={() => setCancelConfirmId(null)}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          QR CHECK-IN MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      {qrBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scan-line {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
            .animate-scan-line {
              animation: scan-line 2.5s ease-in-out infinite;
            }
          `}} />

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setQrBooking(null)}
          />

          {/* Modal card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 overflow-hidden border border-emerald-50">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <QrCode size={15} className="text-emerald-600" />
                </div>
                <h3
                  className="font-bold text-gray-900 text-sm"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Booking QR Check-In
                </h3>
              </div>
              <button
                onClick={() => setQrBooking(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-5 text-center">
              {/* QR Container / Loader / Error */}
              <div className="relative w-56 h-56 mx-auto mb-5 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden">
                {qrLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-50/95">
                    {/* Simulated QR skeleton */}
                    <div className="w-40 h-40 border-2 border-dashed border-gray-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                      <Loader2 className="animate-spin text-emerald-500" size={24} />
                      {/* Laser scanning line animation */}
                      <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-scan-line" />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-400 mt-3 animate-pulse">
                      Generating secure pass...
                    </span>
                  </div>
                )}

                {qrError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-red-50/50">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
                      <AlertTriangle className="text-red-500" size={20} />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Failed to load QR</p>
                    <p className="text-[11px] text-gray-500 mb-4 px-2 leading-relaxed">{qrError}</p>
                    <button
                      onClick={() => {
                        // Force refresh by resetting states
                        setQrError(null)
                        setQrLoading(true)
                        const b = qrBooking
                        setQrBooking(null)
                        setTimeout(() => setQrBooking(b), 50)
                      }}
                      className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {qrData && (
                  <div className="relative group">
                    <img
                      src={qrData.qr_data_url}
                      alt="Booking QR Code"
                      className="w-48 h-48 rounded-xl border border-emerald-100/50 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    {/* Tiny visual accent for camera target */}
                    <div className="absolute -inset-1 border-2 border-emerald-500/20 rounded-2xl pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Booking Context */}
              <div className="mb-5">
                <p
                  className="font-bold text-gray-800 text-sm mb-1"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {qrBooking.facility_name}
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span>{formatDate(qrBooking.booking_date)}</span>
                  <span>•</span>
                  <span>{qrBooking.booking_time_slot}</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold">
                  <Clock size={11} />
                  <span>Check-in Window: {getCheckinWindow(qrBooking.booking_time_slot)}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100/50 text-left mb-5">
                <div className="flex gap-2 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-emerald-700">i</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-700">How to check in?</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                      Show this QR code to the campus staff or admin at the facility. They will scan it using their admin panel to verify and check you in.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <button
                onClick={() => setQrBooking(null)}
                className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
