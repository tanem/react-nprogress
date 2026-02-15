'use client'

import Link from 'next/link'

import { useNavigationProgress } from './NavigationProgress'

// A thin wrapper around next/link that signals navigation start via the
// onNavigate callback introduced in Next.js 15.3. Use this in place of <Link>
// wherever you want the progress bar to appear during navigation.
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
