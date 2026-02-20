'use client'

import Link from 'next/link'

import { useNavigationProgress } from './NavigationProgress'

// Uses the onNavigate callback introduced in Next.js 15.3 to signal navigation
// start to <NavigationProgress>.
export default function ProgressLink(props: React.ComponentProps<typeof Link>) {
  const { start } = useNavigationProgress()

  return (
    <Link
      {...props}
      onNavigate={(e) => {
        start()
        props.onNavigate?.(e)
      }}
    />
  )
}
