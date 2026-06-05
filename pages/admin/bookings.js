import { useState } from 'react'
import { Search, X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import StatusBadge from '@/components/StatusBadge'
import { ALL_BOOKINGS, FAKE_STUDENT } from '@/lib/fakeData'

// Enrich bookings with user name for display
const enriched = ALL_BOOKINGS.map(b => ({
  ...b,
  user_name: b.user_name || FAKE_STUDENT.user_name,
}))

const STATUS_FILTERS = ['all', 'booked', 'checked-in', 'no-show', 'cancelled']

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(enriched)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cancelModal, setCancelModal] = useState(null) // booking object
  const [cancelReason, setCancelReason] = useState('')

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.facility_name.toLowerCase().includes(search.toLowerCase()) ||
      b.user_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.booking_status === statusFilter
    return matchSearch && matchStatus
  })

  function handleStatusChange(id, newStatus) {
    setBookings(prev => prev.map(b => b.booking_id === id ? { ...b, booking_status: newStatus } : b))
    const labels = { 'checked-in': 'Marked as checked-in', 'no-show': 'Marked as no-show', 'cancelled': 'Booking cancelled' }
    toast(labels[newStatus] || 'Status updated', { icon: newStatus === 'cancelled' ? '🚫' : '✅' })
  }

  function confirmCancel() {
    if (!cancelReason.trim()) { toast.error('Please enter a reason.'); return }
    setBookings(prev => prev.map(b =>
      b.booking_id === cancelModal.booking_id
        ? { ...b, booking_status: 'cancelled', booking_cancel_reason: cancelReason }
        : b
    ))
    toast('Booking cancelled', { icon: '🚫' })
    setCancelModal(null)
    setCancelReason('')
  }

  return (
    <AdminLayout title="Manage Bookings">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student or facility…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900 placeholder-gray-300 bg-white"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-150 will-change-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                statusFilter === s ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3">Showing {filtered.length} of {bookings.length} bookings</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Student', 'Facility', 'Date & Time', 'Group', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(b => (
                <tr key={b.booking_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                        {b.user_name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 text-xs whitespace-nowrap">{b.user_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap">{b.facility_name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                    <div>{b.booking_date}</div>
                    <div className="text-gray-400">{b.booking_time_slot}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs text-center">{b.booking_group_size}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.booking_status} /></td>
                  <td className="px-4 py-3">
                    {b.booking_status === 'booked' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStatusChange(b.booking_id, 'checked-in')}
                          title="Mark checked-in"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 transition-all will-change-transform hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(b.booking_id, 'no-show')}
                          title="Mark no-show"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 active:bg-amber-100 transition-all will-change-transform hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <AlertCircle size={15} />
                        </button>
                        <button
                          onClick={() => setCancelModal(b)}
                          title="Cancel booking"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-all will-change-transform hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          <XCircle size={15} />
                        </button>
                      </div>
                    )}
                    {b.booking_status !== 'booked' && (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-14 text-center">
            <p className="text-gray-400 text-sm">No bookings match your filters.</p>
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancelModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>Cancel Booking</h3>
              <button onClick={() => setCancelModal(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Cancelling <strong>{cancelModal.facility_name}</strong> for <strong>{cancelModal.user_name}</strong> on {cancelModal.booking_date}.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason <span className="text-red-400">*</span></label>
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                rows={3}
                placeholder="e.g. Facility maintenance scheduled"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition resize-none text-gray-900 placeholder-gray-300"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={confirmCancel}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 will-change-transform hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-red-500">
                Confirm Cancel
              </button>
              <button onClick={() => { setCancelModal(null); setCancelReason('') }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300">
                Keep It
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

