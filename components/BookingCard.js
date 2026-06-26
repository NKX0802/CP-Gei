import { XCircle, Eye, QrCode, Clock, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react'
import StatusBadge from './StatusBadge'

const ACCENT = {
  booked: 'border-l-primary-500',
  'checked-in': 'border-l-emerald-500',
  'no-show': 'border-l-red-400',
  cancelled: 'border-l-gray-300',
}

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
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Given a time-slot string like "10:00-11:00", returns the check-in window label:
 * e.g. "10:00 AM – 10:15 AM"
 */
function getCheckinWindow(timeSlot) {
  if (!timeSlot) return null
  const start = timeSlot.split('-')[0]?.trim() // "10:00"
  if (!start) return null

  const [hourStr, minStr] = start.split(':')
  const hour = parseInt(hourStr, 10)
  const min = parseInt(minStr, 10)
  if (isNaN(hour) || isNaN(min)) return null

  // End of window = start + 15 min
  const endTotalMin = hour * 60 + min + 15
  const endHour = Math.floor(endTotalMin / 60) % 24
  const endMin = endTotalMin % 60

  function fmt(h, m) {
    const suffix = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
  }

  return `${fmt(hour, min)} – ${fmt(endHour, endMin)}`
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * BookingCard
 *
 * Props:
 *  booking        — booking row (joined with facility)
 *  onCancel(id)       — called when user clicks Cancel → opens confirm modal in parent
 *  onViewDetails(booking) — called when user clicks View Details → opens details modal in parent
 *  onQRCheckin(booking)   — called when user clicks QR Check-In → opens QR modal in parent
 */
export default function BookingCard({ booking, onCancel, onViewDetails, onQRCheckin }) {
  const status = booking.booking_status
  const canCancel = status === 'booked'
  const isActive = status === 'booked'
  const checkinWin = getCheckinWindow(booking.booking_time_slot)

  return (
    <div
      className={`bg-white rounded-xl border border-l-4 p-4 sm:p-5 transition-shadow duration-200 hover:shadow-md ${ACCENT[status] || 'border-l-gray-300'} ${
        status === 'cancelled' || status === 'no-show' ? 'border-gray-100 opacity-75' : 'border-gray-100'
      }`}
    >
      {/* ── Top row: facility name + status badge ── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
            {booking.facility_name}
          </h3>
          {booking.facility_type && (
            <span className="text-xs text-gray-400 capitalize">{booking.facility_type}</span>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* ── Details row ── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} className="text-gray-400" /> {formatDate(booking.booking_date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-gray-400" /> {booking.booking_time_slot}
        </span>
      </div>

      {checkinWin && isActive && (
        <p className="text-xs text-primary-700 bg-primary-50 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5 mb-3">
          <Clock size={11} className="text-primary-500 shrink-0" />
          Check-in window: {checkinWin}
        </p>
      )}
      {status === 'checked-in' && booking.checked_in_at && (
        <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5 mb-3">
          <CheckCircle2 size={11} className="shrink-0" /> Checked in at {formatDateTime(booking.checked_in_at)}
        </p>
      )}
      {status === 'no-show' && booking.no_show_marked_at && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5 mb-3">
          <AlertTriangle size={11} className="shrink-0" /> No-show marked at {formatDateTime(booking.no_show_marked_at)}
        </p>
      )}
      {status === 'cancelled' && booking.booking_cancel_reason && (
        <p className="text-xs text-gray-400 mb-3">{booking.booking_cancel_reason}</p>
      )}

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap gap-2">
        {/* View Details — always visible */}
        <button
          id={`view-details-${booking.booking_id}`}
          onClick={() => onViewDetails && onViewDetails(booking)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <Eye size={13} />
          View Details
        </button>

        {/* QR Check-In — only for 'booked' */}
        {canCancel && (
          <button
            id={`qr-checkin-${booking.booking_id}`}
            onClick={() => onQRCheckin && onQRCheckin(booking)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 active:bg-primary-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <QrCode size={13} />
            QR Check-In
          </button>
        )}

        {/* Cancel — only for 'booked' */}
        {canCancel && (
          <button
            id={`cancel-booking-${booking.booking_id}`}
            onClick={() => onCancel && onCancel(booking.booking_id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <XCircle size={13} />
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  )
}
