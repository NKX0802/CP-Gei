import { useState, useEffect, useCallback } from 'react'
import {
  Send, Users, User, Bell, Megaphone, Calendar, QrCode,
  AlertTriangle, XCircle, Trash2, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'

const TYPE_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'booking', label: 'Booking' },
  { value: 'check-in', label: 'Check-In' },
  { value: 'no-show', label: 'No-Show' },
  { value: 'cancelled', label: 'Cancelled' },
]

const TYPE_CONFIG = {
  general:      { label: 'General',      icon: Bell,          bg: 'bg-gray-100',    text: 'text-gray-500'    },
  announcement: { label: 'Announcement', icon: Megaphone,     bg: 'bg-blue-100',    text: 'text-blue-600'    },
  booking:      { label: 'Booking',      icon: Calendar,      bg: 'bg-emerald-100', text: 'text-emerald-600' },
  'check-in':   { label: 'Check-In',     icon: QrCode,        bg: 'bg-emerald-100', text: 'text-emerald-600' },
  'no-show':    { label: 'No-Show',      icon: AlertTriangle, bg: 'bg-red-100',     text: 'text-red-500'     },
  cancelled:    { label: 'Cancelled',    icon: XCircle,       bg: 'bg-gray-100',    text: 'text-gray-500'    },
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// Identifies a "sent" batch so it can be deleted as a whole
function sentKey(n) {
  return `${n.title}|${n.message}|${n.notification_type}|${n.created_by}|${n.created_at}`
}

export default function SendNotificationPage() {
  const [sendTo, setSendTo] = useState('all') // 'all' | 'single'
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [notificationType, setNotificationType] = useState('announcement')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const [sent, setSent] = useState([])
  const [sentLoading, setSentLoading] = useState(true)
  const [deletingKey, setDeletingKey] = useState(null)

  useEffect(() => {
    async function loadUsers() {
      setUsersLoading(true)
      try {
        const res = await fetch('/api/admin/users')
        const data = await res.json()
        if (data.success) setUsers(data.data)
      } catch {
        // silently ignore — dropdown will just stay empty
      } finally {
        setUsersLoading(false)
      }
    }
    loadUsers()
  }, [])

  const loadSent = useCallback(async () => {
    setSentLoading(true)
    try {
      const res = await fetch('/api/admin/notifications')
      const data = await res.json()
      if (data.success) setSent(data.data)
    } catch {
      // silently ignore — history panel will just stay empty
    } finally {
      setSentLoading(false)
    }
  }, [])

  useEffect(() => { loadSent() }, [loadSent])

  function handleSendToChange(value) {
    setSendTo(value)
    // "All Users" broadcasts are always announcements — no type picker needed
    if (value === 'all') setNotificationType('announcement')
  }

  async function handleSend(e) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Title is required.')
      return
    }
    if (!message.trim()) {
      toast.error('Message is required.')
      return
    }
    if (sendTo === 'single' && !userId) {
      toast.error('Please select a user to send to.')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sendTo,
          user_id: sendTo === 'single' ? userId : undefined,
          title: title.trim(),
          message: message.trim(),
          notification_type: sendTo === 'all' ? 'announcement' : notificationType,
        }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message || 'Notification sent!')
        setTitle('')
        setMessage('')
        setUserId('')
        loadSent()
      } else {
        toast.error(data.error || 'Failed to send notification.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  async function handleDelete(n) {
    const key = sentKey(n)
    setDeletingKey(key)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: n.title,
          message: n.message,
          notification_type: n.notification_type,
          created_by: n.created_by,
          created_at: n.created_at,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(prev => prev.filter(item => sentKey(item) !== key))
        toast('Notification deleted.', { icon: '🗑️' })
      } else {
        toast.error(data.error || 'Failed to delete notification.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setDeletingKey(null)
    }
  }

  return (
    <AdminLayout title="Send Notification">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Send form */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <form onSubmit={handleSend} className="space-y-5">

              {/* Send To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Send To</label>
                <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleSendToChange('all')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      sendTo === 'all' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Users size={15} /> All Users
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendToChange('single')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      sendTo === 'single' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User size={15} /> Specific User
                  </button>
                </div>
              </div>

              {/* User dropdown */}
              {sendTo === 'single' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    User <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    disabled={usersLoading}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900 disabled:opacity-60"
                  >
                    <option value="">{usersLoading ? 'Loading users…' : 'Select a user'}</option>
                    {users.map(u => (
                      <option key={u.user_id} value={u.user_id}>
                        {u.user_name} ({u.user_email}){u.user_role === 'admin' ? ' — admin' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Notification type — only relevant when sending to a specific user;
                  broadcasts to everyone are always "announcement" */}
              {sendTo === 'single' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notification Type</label>
                  <select
                    value={notificationType}
                    onChange={e => setNotificationType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                  >
                    {TYPE_OPTIONS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Facility Closure"
                  maxLength={150}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900 placeholder-gray-300"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Type your notification message here…"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none text-gray-900 placeholder-gray-300"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 will-change-transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:scale-100 transition-all duration-200 shadow-md shadow-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Sending…
                  </span>
                ) : (
                  <><Send size={15} /> Send Notification</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sent history */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Sent Notifications</h2>
              {!sentLoading && <span className="text-xs text-gray-400">{sent.length} sent</span>}
            </div>

            {sentLoading ? (
              <div className="py-16 flex items-center justify-center">
                <Loader2 size={22} className="animate-spin text-emerald-400" />
              </div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-130 overflow-y-auto">
                {sent.map(n => {
                  const cfg = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.general
                  const Icon = cfg.icon
                  const key = sentKey(n)
                  const recipient = n.recipient_count > 1
                    ? `All Users (${n.recipient_count})`
                    : (n.sample_user_name || `User #${n.sample_user_id}`)
                  return (
                    <div key={key} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon size={14} className={cfg.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-xs font-semibold text-gray-500">{recipient}</p>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">{n.message}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(n)}
                        disabled={deletingKey === key}
                        title="Delete this notification"
                        className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 active:scale-90 disabled:opacity-50 transition-all duration-150"
                      >
                        {deletingKey === key ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  )
                })}
                {sent.length === 0 && (
                  <div className="py-12 text-center">
                    <Bell size={28} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications sent yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
