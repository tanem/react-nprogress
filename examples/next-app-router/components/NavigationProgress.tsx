'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import Loading from './Loading'

type NavigationProgressContextType = {
  start(): void
}

const NavigationProgressContext =
  createContext<NavigationProgressContextType | null>(null)

export function useNavigationProgress() {
  const context = useContext(NavigationProgressContext)
  if (!context) {
    throw new Error(
      'useNavigationProgress must be used within <NavigationProgress>',
    )
  }
  return context
}

// Watches pathname/searchParams changes to detect when navigation has
// completed. Wrapped in Suspense because useSearchParams() requires a Suspense
// boundary.
function NavigationComplete({ onComplete }: { onComplete: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentUrl = useRef(pathname + searchParams.toString())

  useEffect(() => {
    const newUrl = pathname + searchParams.toString()
    if (newUrl !== currentUrl.current) {
      currentUrl.current = newUrl
      onComplete()
    }
  }, [pathname, searchParams, onComplete])

  return null
}

// Provides navigation progress state to the component tree. Navigation start is
// signalled via the onNavigate prop on a <ProgressLink>, and completion is
// detected by watching usePathname()/useSearchParams().
export default function NavigationProgress({
  children,
}: {
  children: React.ReactNode
}) {
  const [isRouteChanging, setIsRouteChanging] = useState(false)
  const [loadingKey, setLoadingKey] = useState(0)

  const contextValue = useRef<NavigationProgressContextType>({
    start: () => {
      setIsRouteChanging(true)
      setLoadingKey((prev) => prev ^ 1)
    },
  }).current

  const handleComplete = useCallback(() => setIsRouteChanging(false), [])

  return (
    <NavigationProgressContext.Provider value={contextValue}>
      <Loading isRouteChanging={isRouteChanging} key={loadingKey} />
      <Suspense>
        <NavigationComplete onComplete={handleComplete} />
      </Suspense>
      {children}
    </NavigationProgressContext.Provider>
  )
}
