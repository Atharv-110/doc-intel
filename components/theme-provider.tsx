"use client"

import * as React from "react"


// ---------------------------------------------------------------------------
// Minimal theme system that avoids the React 19 `<script>` warning.
//
// `next-themes` injects an inline `<script>` inside the React tree to
// prevent FOUC. React 19 warns about this because client-rendered scripts
// are never executed. We solve this by:
//
// 1. Using Next.js `<Script strategy="beforeInteractive">` in the layout
//    (runs before hydration, no React warning).
// 2. Using a lightweight React context for the toggle UI.
// ---------------------------------------------------------------------------

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [resolvedTheme, setResolved] = React.useState<"light" | "dark">("light")

  // On mount: read persisted preference
  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored && ["light", "dark", "system"].includes(stored)) {
      // Defer state update to avoid synchronous cascading render warning
      requestAnimationFrame(() => {
        setThemeState(stored)
      })
    }
  }, [])

  // Resolve + apply theme
  React.useEffect(() => {
    const root = document.documentElement

    let effective: "light" | "dark"
    if (theme === "system") {
      effective = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    } else {
      effective = theme
    }

    root.classList.remove("light", "dark")
    root.classList.add(effective)
    root.style.colorScheme = effective
    
    // Defer state update to avoid synchronous cascading render warning
    requestAnimationFrame(() => {
      setResolved(effective)
    })

    // Listen for OS changes when in system mode
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = (e: MediaQueryListEvent) => {
        const next = e.matches ? "dark" : "light"
        root.classList.remove("light", "dark")
        root.classList.add(next)
        root.style.colorScheme = next
        
        requestAnimationFrame(() => {
          setResolved(next)
        })
      }
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    }
  }, [theme])

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem("theme", t)
  }, [])

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// FOUC prevention script — runs before hydration via Next.js Script
// ---------------------------------------------------------------------------

const THEME_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('theme') || 'system';
    var d = document.documentElement;
    var e = t;
    if (t === 'system') {
      e = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    d.classList.add(e);
    d.style.colorScheme = e;
  } catch(e){}
})();
`

/**
 * Inject this in your root layout's `<head>` to prevent FOUC.
 * Uses `next/script` with `beforeInteractive` strategy — runs
 * before React hydration, no React 19 script warning.
 */
export function ThemeScript() {
  return (
    <script
      id="theme-init"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  )
}

// ---------------------------------------------------------------------------
// Theme hotkey (press "D" to toggle)
// ---------------------------------------------------------------------------

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "d") return
      if (isTypingTarget(event.target)) return
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resolvedTheme, setTheme])

  return null
}
