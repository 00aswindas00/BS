import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { LoadingScreen } from './shared/LoadingScreen'

/** Paths that should NOT show the page-transition loader (login / signup / etc.) */
const SKIP_PATHS = new Set(['/', '/signup', '/forgot-password'])

interface PageTransitionProps {
  children: ReactNode
}

/**
 * Shows a 1-second full-screen loading overlay every time the user
 * navigates to a new route (except the auth pages listed in SKIP_PATHS).
 */
export function PageTransition({ children }: PageTransitionProps) {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(false)
  const prevPath = useRef(pathname)

  useEffect(() => {
    // Only trigger on actual path changes, skip auth pages
    if (pathname !== prevPath.current && !SKIP_PATHS.has(pathname)) {
      setLoading(true)
      const timer = setTimeout(() => setLoading(false), 1000)
      prevPath.current = pathname
      return () => clearTimeout(timer)
    }
    prevPath.current = pathname
  }, [pathname])

  return (
    <>
      <LoadingScreen visible={loading} />
      {children}
    </>
  )
}
