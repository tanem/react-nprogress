import { connection } from 'next/server'

export default async function ForeverPage() {
  // Stands in for the uncached fetch a real app would make: it keeps the route
  // out of the static prerender, so the delay below runs on every navigation.
  await connection()
  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })

  return <p>This page was rendered for a while!</p>
}
