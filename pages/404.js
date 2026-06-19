import Link from 'next/link'
import { Building2, Home, LayoutDashboard } from 'lucide-react'
import { useRole } from '@/lib/roleContext'
import AdminLayout from '@/components/AdminLayout'

function NotFoundContent({ embedded }) {
  const { role } = useRole()
  const isAdmin = role === 'admin'
  const isUser = role === 'user'

  const href = isAdmin ? '/admin/dashboard' : isUser ? '/dashboard' : '/'
  const label = isAdmin || isUser ? 'Back to Dashboard' : 'Back to Home'
  const Icon = isAdmin || isUser ? LayoutDashboard : Home

  return (
    <div className={`bg-green-50 flex items-center justify-center px-4 ${embedded ? 'py-12 rounded-2xl' : 'min-h-screen pt-16'}`}>
      <div className="max-w-lg w-full text-center">

        {/* Big 404 */}
        <div className="relative inline-block mb-6">
          <span
            className="text-[120px] sm:text-[160px] font-extrabold text-emerald-100 leading-none select-none"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Building2 size={32} className="text-white sm:hidden" />
              <Building2 size={40} className="text-white hidden sm:block" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1
          className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Page not found
        </h1>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Action — role-aware */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold will-change-transform hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Icon size={16} />
          {label}
        </Link>
      </div>
    </div>
  )
}

export default function NotFoundPage() {
  const { role } = useRole()

  if (role === 'admin') {
    return (
      <AdminLayout>
        <NotFoundContent embedded />
      </AdminLayout>
    )
  }

  return <NotFoundContent />
}
