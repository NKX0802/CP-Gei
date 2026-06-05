import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, Save, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRole } from '@/lib/roleContext'
import { FAKE_STUDENT } from '@/lib/fakeData'

export default function ProfilePage() {
  const { switchRole } = useRole()
  const [name, setName] = useState(FAKE_STUDENT.user_name)
  const [email] = useState(FAKE_STUDENT.user_email)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success('Profile updated successfully!')
  }

  function handleLogout() {
    toast('Logged out. See you next time!', { icon: '👋' })
    setTimeout(() => switchRole('user'), 1000)
  }

  return (
    <div className="min-h-screen bg-green-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
        </div>

        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl font-extrabold shrink-0">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>{name}</p>
            <p className="text-sm text-gray-500">{email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
              Student
            </span>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>Edit Information</h2>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-gray-300 text-gray-900"
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
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 will-change-transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:scale-100 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 will-change-transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

