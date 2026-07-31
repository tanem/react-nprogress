'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import {
  createContext,
  Suspense,
  use,
  useCallback,
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
  const context = use(NavigationProgressContext)
  if (!context) {
    throw new Error(
      'useNavigationProgress must be used within <NavigationProgress>',
    )
  }
  return context
}

// Wrapped in Suspense because useSearchParams() requires a Suspense boundary.
function NavigationComplete({ onComplete }: { onComplete: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentUrlRef = useRef(pathname + searchParams.toString())

  useEffect(() => {
    const newUrl = pathname + searchParams.toString()
    if (newUrl !== currentUrlRef.current) {
      currentUrlRef.current = newUrl
      onComplete()
    }
  }, [pathname, searchParams, onComplete])

  return null
}

// Navigation start is signalled via onNavigate on a <ProgressLink>; completion
// is detected by watching usePathname()/useSearchParams().
export default function NavigationProgress({
  children,
}: {
  children: React.ReactNode
}) {
  const [isRouteChanging, setIsRouteChanging] = useState(false)
  const [loadingKey, setLoadingKey] = useState(0)

  // Read directly during render to lazily create a stable context value
  // once; useRef's initial-value argument is only ever used on the very
  // first render.
  // eslint-disable-next-line react-hooks/refs
  const contextValue = useRef<NavigationProgressContextType>({
    start: () => {
      setIsRouteChanging(true)
      // A new key on each start remounts the bar, so it re-enters from the
      // left rather than animating backwards from where the last navigation
      // finished.
      setLoadingKey((prev) => prev ^ 1)
    },
  }).current

  const handleComplete = useCallback(() => setIsRouteChanging(false), [])

  return (
    <NavigationProgressContext value={contextValue}>
      <Loading isRouteChanging={isRouteChanging} key={loadingKey} />
      <Suspense>
        <NavigationComplete onComplete={handleComplete} />
      </Suspense>
      {children}
    </NavigationProgressContext>
  )
}
