import '@/styles/globals.css'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { RoleProvider, useRole } from '@/lib/roleContext'
import { ThemeProvider } from '@/lib/themeContext'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import { nunito } from '@/lib/fonts'

function AppContent({ Component, pageProps }) {
  const router = useRouter()
  const { role } = useRole()
  const isAdminPage = router.pathname.startsWith('/admin')
  const isHomePage = router.pathname === '/'
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register'
  const isErrorPage = router.pathname === '/404' || router.pathname === '/403'

  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => { setHasMounted(true) }, [])
  useEffect(() => {
    if (!hasMounted) return
    if (isAdminPage && role !== 'admin') {
      router.replace('/403')
    }
  }, [hasMounted, role, isAdminPage])

  return (
    <div className={nunito.className}>
      {!isAdminPage && !isHomePage && !isAuthPage && (!isErrorPage || role === 'user') && <Navbar />}
      <main>
        <Component {...pageProps} />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'inherit',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: { primary: '#059669', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </div>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <RoleProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </RoleProvider>
    </ThemeProvider>
  )
}
