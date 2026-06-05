import { Bell, BellOff } from 'lucide-react'
import { NOTIFICATIONS } from '@/lib/fakeData'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-green-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Notifications
          </h1>
        </div>

        {NOTIFICATIONS.length > 0 ? (
          <div className="space-y-3">
            {NOTIFICATIONS.map(n => (
              <div
                key={n.notification_id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell size={15} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed">{n.notification_message}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5">{timeAgo(n.notification_created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <BellOff size={24} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
