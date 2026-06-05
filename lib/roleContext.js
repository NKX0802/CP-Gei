import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const RoleContext = createContext(null)

export function RoleProvider({ children }) {
  const [role, setRole] = useState('user')
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('demoRole')
    if (saved === 'admin' || saved === 'user') {
      setRole(saved)
    }
  }, [])

  function switchRole(newRole) {
    setRole(newRole)
    localStorage.setItem('demoRole', newRole)
    if (newRole === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  function logout() {
    setRole('user')
    localStorage.setItem('demoRole', 'user')
    router.push('/login')
  }

  return (
    <RoleContext.Provider value={{ role, switchRole, logout }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used inside RoleProvider')
  return ctx
}
