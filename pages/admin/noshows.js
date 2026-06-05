import { useState } from 'react'
import { AlertCircle, Bell, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { ALL_BOOKINGS, FAKE_STUDENT } from '@/lib/fakeData'

// Build no-show report from bookings
const noShowBookings = ALL_BOOKINGS
  .filter(b => b.booking_status === 'no-show')
  .map(b => ({ ...b, user_name: b.user_name || FAKE_STUDENT.user_name }))

// Group by user
function buildReport(bookings) {
  const map = {}
  bookings.forEach(b => {
    const key = b.user_name
    if (!map[key]) map[key] = { user_name: key, count: 0, latest: b.booking_date, bookings: [] }
    map[key].count++
    map[key].bookings.push(b)
    if (b.booking_date > map[key].latest) map[key].latest = b.booking_date
  })
  return Object.values(map).sort((a, b) => b.count - a.count)
}

const STATS = [
  { label: 'Total No-Shows', value: noShowBookings.length, color: 'text-red-600 bg-red-50 border-red-100' },
  { label: 'Students Affected', value: buildReport(noShowBookings).length, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { label: 'This Month', value: noShowBookings.filter(b => b.booking_date.startsWith('2026-05') || b.booking_date.startsWith('2026-06')).length, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
]

export default function AdminNoshowsPage() {
  const report = buildReport(noShowBookings)
  const [warned, setWarned] = useState([])
  const [expanded, setExpanded] = useState(null)

  function sendWarning(name) {
    setWarned(prev => [...prev, name])
    toast.success(`Warning notification sent to ${name.split(' ')[0]}`)
  }

  return (
    <AdminLayout title="No-Show Report">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {STATS.map(({ label, value, color }) => (
          <div key={label} className={`bg-white rounded-2xl border shadow-sm p-4 ${color.includes('border') ? color.split(' ').find(c => c.startsWith('border')) : 'border-gray-100'}`}>
            <p className={`text-2xl font-extrabold ${color.split(' ')[0]}`} style={{ fontFamily: 'Nunito, sans-serif' }}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Report table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Students with No-Shows</h2>
          <span className="text-xs text-gray-400">{report.length} student{report.length !== 1 ? 's' : ''}</span>
        </div>

        {report.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <p className="font-semibold text-gray-500">No no-shows recorded</p>
            <p className="text-xs text-gray-400 mt-1">Great attendance across all bookings!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {report.map(r => (
              <div key={r.user_name}>
                <div
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === r.user_name ? null : r.user_name)}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold shrink-0">
                    {r.user_name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{r.user_name}</p>
                    <p className="text-xs text-gray-400">Latest: {r.latest}</p>
                  </div>

                  {/* Count badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      r.count >= 3 ? 'bg-red-100 text-red-700' : r.count >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <AlertCircle size={11} /> {r.count} no-show{r.count !== 1 ? 's' : ''}
                    </span>

                    <button
                      onClick={e => { e.stopPropagation(); sendWarning(r.user_name) }}
                      disabled={warned.includes(r.user_name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 will-change-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                        warned.includes(r.user_name)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed scale-100'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      <Bell size={12} />
                      {warned.includes(r.user_name) ? 'Warned' : 'Warn'}
                    </button>
                  </div>
                </div>

                {/* Expanded: individual no-show bookings */}
                {expanded === r.user_name && (
                  <div className="bg-gray-50 px-5 py-3 space-y-2 border-t border-gray-100">
                    {r.bookings.map(b => (
                      <div key={b.booking_id} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-100 text-xs">
                        <AlertCircle size={13} className="text-red-400 shrink-0" />
                        <span className="font-medium text-gray-700">{b.facility_name}</span>
                        <span className="text-gray-400">{b.booking_date}</span>
                        <span className="text-gray-400">{b.booking_time_slot}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

