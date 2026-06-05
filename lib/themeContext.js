import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('campusTheme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  function toggleTheme() {
    setDark(prev => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('campusTheme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('campusTheme', 'light')
      }
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
