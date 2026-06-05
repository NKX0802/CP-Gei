import { useState } from 'react'
import Link from 'next/link'
import { Plus, Calendar } from 'lucide-react'
import BookingCard from '@/components/BookingCard'
import { BOOKINGS } from '@/lib/fakeData'

const TABS = [
  { key: 'booked',    label: 'Upcoming',  statuses: ['booked'] },
  { key: 'completed', label: 'Completed', statuses: ['checked-in'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['no-show', 'cancelled'] },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('booked')
  const [bookings, setBookings] = useState(BOOKINGS)

  function handleCancel(id) {
    setBookings(prev =>
      prev.map(b =>
        b.booking_id === id
          ? { ...b, booking_status: 'cancelled', booking_cancel_reason: 'Cancelled by user' }
          : b
      )
    )
  }

  const upcomingCount = bookings.filter(b => b.booking_status === 'booked').length
  const activeStatuses = TABS.find(t => t.key === activeTab)?.statuses ?? []
  const filtered = bookings.filter(b => activeStatuses.includes(b.booking_status))

  return (
    <div className="min-h-screen bg-green-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {upcomingCount > 0
                ? `${upcomingCount} upcoming ${upcomingCount === 1 ? 'booking' : 'bookings'}`
                : 'No upcoming bookings'}
            </p>
          </div>
          <Link
            href="/rooms"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
          >
            <Plus size={15} /> Add Booking
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-7">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(booking => (
              <BookingCard key={booking.booking_id} booking={booking} onCancel={handleCancel} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Calendar size={24} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">No booking yet</p>
            {activeTab === 'booked' && (
              <>
                <p className="text-xs text-gray-400 mb-5">Start by browsing available facilities.</p>
                <Link
                  href="/rooms"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Plus size={15} /> Browse Facilities
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
