import { useState, useEffect, useCallback } from 'react'
import {
  Bell, BellOff, Megaphone, Calendar, QrCode,
  AlertTriangle, XCircle, CheckCheck, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
]

const TYPE_CONFIG = {
  general:      { label: 'General',      icon: Bell,         bg: 'bg-gray-100',    text: 'text-gray-500'    },
  announcement: { label: 'Announcement', icon: Megaphone,    bg: 'bg-blue-100',    text: 'text-blue-600'    },
  booking:      { label: 'Booking',      icon: Calendar,     bg: 'bg-emerald-100', text: 'text-emerald-600' },
  'check-in':   { label: 'Check-In',     icon: QrCode,       bg: 'bg-emerald-100', text: 'text-emerald-600' },
  'no-show':    { label: 'No-Show',      icon: AlertTriangle, bg: 'bg-red-100',    text: 'text-red-500'     },
  cancelled:    { label: 'Cancelled',    icon: XCircle,      bg: 'bg-gray-100',    text: 'text-gray-500'    },
}

function formatDateTime(dtStr) {
  const d = new Date(dtStr)
  return d.toLocaleString('en-MY', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [marking, setMarking] = useState(null) // notification_id currently being marked
  const [markingAll, setMarkingAll] = useState(false)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/notifications')

      if (res.status === 401) {
        setError('You must be logged in to view your notifications.')
        return
      }

      const data = await res.json()
      if (data.success) {
        setNotifications(data.data)
      } else {
        setError(data.error || 'Failed to load notifications.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  async function handleMarkRead(notificationId) {
    setMarking(notificationId)
    try {
      const res = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notificationId }),
      })
      const data = await res.json()
      if (data.success) {
        setNotifications(prev =>
          prev.map(n => n.notification_id === notificationId ? { ...n, is_read: 1 } : n)
        )
      } else {
        toast.error(data.error || 'Failed to mark notification as read.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setMarking(null)
    }
  }

  async function handleMarkAllRead() {
    setMarkingAll(true)
    try {
      const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })))
        toast.success('All notifications marked as read.')
      } else {
        toast.error(data.error || 'Failed to mark all as read.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setMarkingAll(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length
  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read
    if (filter === 'read') return !!n.is_read
    return true
  })

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 pt-16 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  // ── Error / not logged in ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-green-50 pt-16 flex items-center justify-center">
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        <div className="flex items-start justify-between gap-3 mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 active:scale-95 disabled:opacity-60 transition-all duration-150 shrink-0"
            >
              <CheckCheck size={14} />
              {markingAll ? 'Marking…' : 'Mark All as Read'}
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 mb-5 bg-white p-1 rounded-xl border border-gray-100 w-fit">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                filter === f.key ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-emerald-700'
              }`}
            >
              {f.label}
              {f.key === 'unread' && unreadCount > 0 && (
                <span className={`ml-1.5 ${filter === f.key ? 'text-emerald-100' : 'text-emerald-500'}`}>
                  ({unreadCount})
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(n => {
              const cfg = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.general
              const Icon = cfg.icon
              const unread = !n.is_read
              return (
                <div
                  key={n.notification_id}
                  className={`bg-white rounded-2xl border shadow-sm p-4 sm:p-5 transition-colors ${
                    unread ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={16} className={cfg.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {n.title}
                        </p>
                        {unread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Unread" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                        <span className="text-[11px] text-gray-400">{formatDateTime(n.created_at)}</span>
                      </div>
                    </div>
                    {unread && (
                      <button
                        onClick={() => handleMarkRead(n.notification_id)}
                        disabled={marking === n.notification_id}
                        className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 active:scale-95 disabled:opacity-60 transition-all duration-150"
                      >
                        {marking === n.notification_id ? '…' : 'Mark as read'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <BellOff size={24} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">
              {notifications.length === 0
                ? 'You have no notifications yet.'
                : filter === 'unread'
                ? 'No unread notifications.'
                : 'No read notifications.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
