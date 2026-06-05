import { useState } from 'react'
import { Send, Users, User, Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { NOTIFICATIONS } from '@/lib/fakeData'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function AdminNotificationsPage() {
  const [mode, setMode] = useState('broadcast') // 'broadcast' | 'individual'
  const [message, setMessage] = useState('')
  const [targetEmail, setTargetEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(NOTIFICATIONS.filter(n => n.user_id !== null || true).reverse())

  async function handleSend(e) {
    e.preventDefault()
    if (!message.trim()) { toast.error('Message cannot be empty.'); return }
    if (mode === 'individual' && !targetEmail.trim()) { toast.error('Please enter a recipient email.'); return }

    setSending(true)
    await new Promise(r => setTimeout(r, 800))

    const newNotif = {
      notification_id: Date.now(),
      user_id: mode === 'broadcast' ? null : 99,
      notification_message: message,
      notification_created_at: new Date().toISOString(),
      is_read: false,
      _target: mode === 'broadcast' ? 'All users' : targetEmail,
    }
    setSent(prev => [newNotif, ...prev])
    setSending(false)
    setMessage('')
    setTargetEmail('')
    toast.success(mode === 'broadcast' ? 'Broadcast sent to all users!' : `Notification sent to ${targetEmail}!`)
  }

  return (
    <AdminLayout title="Notifications">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Send form */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Send Notification
            </h2>

            {/* Mode toggle */}
            <div className="flex gap-1.5 mb-5 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setMode('broadcast')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  mode === 'broadcast' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={15} /> Broadcast
              </button>
              <button
                onClick={() => setMode('individual')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  mode === 'individual' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User size={15} /> Individual
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              {/* Individual: email field */}
              {mode === 'individual' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Recipient email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={targetEmail}
                    onChange={e => setTargetEmail(e.target.value)}
                    placeholder="student@campus.edu.my"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900 placeholder-gray-300"
                  />
                </div>
              )}

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
              <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Sent History</h2>
              <span className="text-xs text-gray-400">{sent.length} sent</span>
            </div>
            <div className="divide-y divide-gray-50 max-h-105 overflow-y-auto">
              {sent.map(n => (
                <div key={n.notification_id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.user_id === null ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {n.user_id === null ? <Users size={14} /> : <User size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      {n._target || (n.user_id === null ? 'All users' : `User #${n.user_id}`)}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{n.notification_message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.notification_created_at)}</p>
                  </div>
                </div>
              ))}
              {sent.length === 0 && (
                <div className="py-12 text-center">
                  <Bell size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No notifications sent yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

