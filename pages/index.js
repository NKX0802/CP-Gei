import Link from 'next/link'
import { Building2, Calendar, QrCode, ArrowRight, Zap } from 'lucide-react'
import { useTheme } from '@/lib/themeContext'

export default function HomePage() {
  const { dark } = useTheme()

  return (
    <div className="min-h-screen bg-white">

      {/* Hero — full viewport height */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: dark
              ? 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)'
              : 'linear-gradient(to bottom right, #ecfdf5, #ffffff, #f0fdf4)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
              <Zap size={14} className="text-emerald-600" />
              Smart Campus Facility Booking
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6"
              style={{ fontFamily: 'Nunito, sans-serif', color: dark ? '#e2e8f0' : '#0f172a' }}
            >
              Book campus facilities{' '}
              <span className="text-emerald-500">effortlessly</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed">
              Reserve rooms, courts, and equipment in seconds. Check in with a QR scan,
              manage your bookings, and stay updated — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-semibold text-base hover:bg-emerald-700 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-base hover:border-emerald-400 hover:text-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12" style={{ fontFamily: 'Nunito, sans-serif' }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', icon: Building2, label: 'Find a facility', desc: 'Browse available rooms, courts, and equipment by type or search by name.' },
              { step: '2', icon: Calendar, label: 'Pick a slot', desc: 'Choose your date and hourly time slot. Conflicts are blocked automatically.' },
              { step: '3', icon: QrCode, label: 'Check in', desc: 'Arrive and scan the facility QR code within 15 minutes of your slot start time.' },
            ].map(({ step, icon: Icon, label, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center">
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full text-xs font-bold text-white flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Building2 size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
              CampusBook
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Smart Campus Facility Booking System · Built with Next.js & TiDB Cloud
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs text-gray-500 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="text-xs text-gray-500 hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
