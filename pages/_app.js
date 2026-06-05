import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { RoleProvider } from '@/lib/roleContext'
import { ThemeProvider } from '@/lib/themeContext'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'

function AppContent({ Component, pageProps }) {
  const router = useRouter()
  const isAdminPage = router.pathname.startsWith('/admin')
  const isHomePage = router.pathname === '/'

  return (
    <>
      {!isAdminPage && !isHomePage && <Navbar />}
      <main>
        <Component {...pageProps} />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          },
          success: {
            iconTheme: { primary: '#059669', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </>
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
