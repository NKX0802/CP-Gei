import Link from 'next/link'
import {
  Calendar, CheckCircle2, AlertCircle,
  TrendingUp, ArrowRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import AdminLayout from '@/components/AdminLayout'
import StatusBadge from '@/components/StatusBadge'
import { DASHBOARD_STATS, MONTHLY_BOOKINGS, ALL_BOOKINGS } from '@/lib/fakeData'

const STAT_CARDS = [
  {
    label: 'Total Bookings',
    value: DASHBOARD_STATS.totalBookings,
    icon: Calendar,
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
  },
  {
    label: 'Checked In',
    value: DASHBOARD_STATS.checkedIn,
    icon: CheckCircle2,
    color: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-100',
  },
  {
    label: 'No-Shows',
    value: DASHBOARD_STATS.noShows,
    icon: AlertCircle,
    color: 'bg-red-50 text-red-500',
    border: 'border-red-100',
  },
]

const recentBookings = ALL_BOOKINGS.slice(0, 6)

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard">

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} shadow-sm p-4`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={17} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart — full width */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Monthly Bookings</h2>
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <TrendingUp size={13} /> This year
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_BOOKINGS} barSize={16} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12, fontFamily: 'Outfit, sans-serif' }}
              cursor={{ fill: '#f0fdf4' }}
            />
            <Bar dataKey="bookings" fill="#059669" radius={[6, 6, 0, 0]} name="Bookings" />
            <Bar dataKey="checkins" fill="#6ee7b7" radius={[6, 6, 0, 0]} name="Check-ins" />
            <Bar dataKey="noShows"  fill="#fca5a5" radius={[6, 6, 0, 0]} name="No-Shows" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentBookings.map(b => (
            <div key={b.booking_id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                {(b.user_name || 'L').charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{b.facility_name}</p>
                <p className="text-xs text-gray-400">{b.booking_date} · {b.booking_time_slot}</p>
              </div>
              <StatusBadge status={b.booking_status} />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
