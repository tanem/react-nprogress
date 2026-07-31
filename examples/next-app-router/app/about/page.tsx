import { connection } from 'next/server'

export default async function AboutPage() {
  // Stands in for the uncached fetch a real app would make: it keeps the route
  // out of the static prerender, so the delay below runs on every navigation.
  await connection()
  await new Promise((resolve) => {
    setTimeout(resolve, 500)
  })

  return <p>This is about Next.js!</p>
}
