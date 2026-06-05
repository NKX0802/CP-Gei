import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { User, Mail, Lock, Eye, EyeOff, Building2, ArrowRight, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '@/lib/themeContext'

export default function RegisterPage() {
  const router = useRouter()
  const { dark } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  const passwordsMatch = form.password && form.confirm && form.password === form.confirm
  const passwordStrong = form.password.length >= 8

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirm) {
      toast.error('Please fill in all fields.')
      return
    }
    if (!passwordStrong) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Account created! Please sign in.')
    router.push('/login')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 pt-20"
      style={{
        background: dark
          ? 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)'
          : 'linear-gradient(to bottom right, #f0fdf4, #ffffff, #ecfdf5)',
      }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md group-hover:bg-emerald-700 transition-colors">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Campus<span className="text-emerald-600">Book</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">Join campus and start booking in seconds</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">

          {/* Full name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="e.g. Lim Wei Jie"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-gray-300 text-gray-900"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@campus.edu.my"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-gray-300 text-gray-900"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="Min. 8 characters"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-gray-300 text-gray-900"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password strength */}
            {form.password && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= 8 ? 'bg-emerald-500' : 'bg-red-300'}`} />
                <div className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= 10 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= 12 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                <span className={`text-[10px] font-semibold ${passwordStrong ? 'text-emerald-600' : 'text-red-500'}`}>
                  {form.password.length < 8 ? 'Too short' : form.password.length < 10 ? 'Fair' : form.password.length < 12 ? 'Good' : 'Strong'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirm}
                onChange={update('confirm')}
                placeholder="Re-enter password"
                className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent transition placeholder-gray-300 text-gray-900 ${
                  form.confirm && !passwordsMatch
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-emerald-500'
                }`}
                autoComplete="new-password"
              />
              {passwordsMatch && (
                <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {form.confirm && !passwordsMatch && (
              <p className="text-[11px] text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 will-change-transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 shadow-md shadow-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating account…
              </span>
            ) : (
              <><span>Create Account</span><ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

