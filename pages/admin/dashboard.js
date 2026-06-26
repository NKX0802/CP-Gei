import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar, CheckCircle2, AlertCircle, XCircle,
  Building2, Users, TrendingUp, ArrowRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import AdminLayout from '@/components/AdminLayout'
import StatusBadge from '@/components/StatusBadge'
import { Skeleton, SkeletonStat } from '@/components/Skeleton'
import { useRole } from '@/lib/roleContext'
import { useTheme } from '@/lib/themeContext'

export default function AdminDashboardPage() {
  const { user } = useRole()
  const { dark } = useTheme()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard')
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        } else {
          setError(json.error || 'Failed to load dashboard.')
        }
      } catch {
        setError('Could not connect to server.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <Skeleton className="h-24 sm:h-28 rounded-xl mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonStat key={i} />)}
        </div>
        <Skeleton className="h-64 rounded-xl mb-5" />
        <Skeleton className="h-48 rounded-xl" />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-32">
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    )
  }

  const { stats, monthly, recent } = data

  const STAT_CARDS = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'Checked In',
      value: stats.checkedIn,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      label: 'No-Shows',
      value: stats.noShows,
      icon: AlertCircle,
      color: 'bg-red-50 text-red-500',
      border: 'border-red-100',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'bg-gray-50 text-gray-500',
      border: 'border-gray-100',
    },
    {
      label: 'Active Facilities',
      value: `${stats.activeFacilities} / ${stats.totalFacilities}`,
      icon: Building2,
      color: 'bg-violet-50 text-violet-600',
      border: 'border-violet-100',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-amber-50 text-amber-500',
      border: 'border-amber-100',
    },
  ]

  return (
    <AdminLayout>

      {/* Banner */}
      <div className="relative overflow-hidden bg-primary-600 rounded-xl p-6 sm:p-7 mb-6">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-20 h-20 rounded-2xl bg-white/10 rotate-12 pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-sm text-primary-100 mt-0.5">
            {user ? `Welcome back, ${user.user_name} 👋` : 'Campus operations overview'}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-xl border-t-4 ${border} shadow-sm p-4`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={17} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">Monthly Bookings</h2>
          <span className="flex items-center gap-1 text-xs text-primary-600 font-semibold">
            <TrendingUp size={13} /> {new Date().getFullYear()}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} barSize={16} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#334155' : '#ecfdf5'} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${dark ? '#334155' : '#e5e7eb'}`,
                boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
                fontSize: 12,
                backgroundColor: dark ? '#1e293b' : '#ffffff',
                color: dark ? '#f1f5f9' : '#111827',
              }}
              labelStyle={{ color: dark ? '#94a3b8' : '#6b7280' }}
              cursor={{ fill: dark ? '#334155' : '#ecfdf5' }}
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
          <h2 className="font-bold text-gray-800">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 hover:underline">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No bookings yet.</p>
          ) : (
            recent.map(b => (
              <div key={b.booking_id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold shrink-0">
                  {(b.user_name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{b.facility_name}</p>
                  <p className="text-xs text-gray-400">{b.user_name} · {b.booking_date} · {b.booking_time_slot}</p>
                </div>
                <StatusBadge status={b.booking_status} />
              </div>
            ))
          )}
        </div>
      </div>

    </AdminLayout>
  )
}
