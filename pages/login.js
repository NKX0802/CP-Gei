import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Mail, Lock, Eye, EyeOff, Building2, ArrowRight, ArrowLeft,
  User, Shield, Calendar, QrCode, BellRing,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useRole } from '@/lib/roleContext'
import { FAKE_STUDENT, FAKE_ADMIN } from '@/lib/fakeData'

const DEMO_ACCOUNTS = [
  {
    label: 'User Account',
    icon: User,
    email: FAKE_STUDENT.user_email,
    password: 'student123',
    role: 'user',
    color: 'border-primary-200 hover:border-primary-400 hover:bg-primary-50',
    iconColor: 'text-primary-600 bg-primary-100',
    name: FAKE_STUDENT.user_name,
  },
  {
    label: 'Admin Account',
    icon: Shield,
    email: FAKE_ADMIN.user_email,
    password: 'admin123',
    role: 'admin',
    color: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50',
    iconColor: 'text-indigo-600 bg-indigo-100',
    name: FAKE_ADMIN.user_name,
  },
]

const PANEL_POINTS = [
  { icon: Calendar, text: 'Hourly slots with automatic conflict checks' },
  { icon: QrCode, text: 'QR check-in scanned by staff on arrival' },
  { icon: BellRing, text: 'Live updates on every booking and check-in' },
]

export default function LoginPage() {
  const { refreshRole } = useRole()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  function fillDemo(account) {
    setEmail(account.email)
    setPassword(account.password)
    toast(`Demo credentials filled for ${account.label}`, { icon: '✏️', duration: 2000 })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error(data.error || 'Invalid email or password.')
        setLoading(false)
        return
      }

      toast.success(`Welcome back, ${data.data.user_name.split(' ')[0]}!`)
      await refreshRole()

      if (data.data.user_role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      toast.error('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: brand panel (decorative, hidden below lg) */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-primary-600 flex-col justify-between p-10 overflow-hidden">
        {/* Flat decorative shapes — no blur/gradient, just layered geometry */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute bottom-10 -left-10 w-40 h-40 rounded-3xl bg-white/10 rotate-12 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-16 h-16 rounded-2xl bg-primary-400/40 pointer-events-none" />

        <Link href="/" className="relative flex items-center gap-2 z-10">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Building2 size={20} className="text-primary-600" />
          </div>
          <span className="text-xl font-bold text-white">
            Flexi<span className="text-primary-200">Book</span>
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Campus facilities,<br />booked in seconds.
          </h2>
          <div className="space-y-3 mt-6">
            {PANEL_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <p className="text-sm text-primary-50">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-primary-200">
          Smart Campus Facility Booking System
        </p>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-white">
        {/* Back to home — only shown when the brand panel is hidden */}
        <Link
          href="/"
          className="fixed top-4 left-4 lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-300 dark:hover:border-primary-500 px-3 py-2 rounded-xl shadow-sm transition-all duration-200"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        <div className="w-full max-w-md">

          {/* Logo — only shown when the brand panel is hidden */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-md group-hover:bg-primary-700 transition-colors">
                <Building2 size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Flexi<span className="text-primary-600">Book</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to manage your bookings</p>
          </div>

          {/* Demo account cards */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map(acc => {
                const Icon = acc.icon
                return (
                  <button
                    key={acc.role}
                    onClick={() => fillDemo(acc)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${acc.iconColor}`}>
                      <Icon size={18} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-800">{acc.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{acc.email.split('@')[0]}@…</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or enter manually</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@campus.edu.my"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm hover:border-primary-300 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder-gray-300 text-gray-900"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm hover:border-primary-300 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder-gray-300 text-gray-900"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 will-change-transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <><span>Sign In</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
