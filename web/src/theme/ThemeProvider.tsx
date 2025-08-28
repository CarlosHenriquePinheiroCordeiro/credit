import React from 'react'

type ThemeMode = 'light' | 'dark' | 'system'
type Ctx = {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
  isDark: boolean
}
const ThemeContext = React.createContext<Ctx | null>(null)

const STORAGE_KEY = 'theme'

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = mode === 'system' ? systemDark : mode === 'dark'
  root.classList.toggle('dark', dark)
  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
  if (meta) meta.content = dark ? '#121414' : '#F1F6F5'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    return saved ?? 'system'
  })

  const [isDark, setIsDark] = React.useState<boolean>(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    const effective = saved ?? 'system'
    return effective === 'system' ? systemDark : effective === 'dark'
  })

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    applyTheme(mode)
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => {
      const dark = mode === 'system' ? system.matches : mode === 'dark'
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    }
    update()
    system.addEventListener('change', update)
    return () => system.removeEventListener('change', update)
  }, [mode])

  const value = React.useMemo<Ctx>(() => ({ mode, setMode, isDark }), [mode, isDark])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
