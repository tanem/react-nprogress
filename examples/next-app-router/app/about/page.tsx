export default async function AboutPage() {
  await new Promise((resolve) => {
    setTimeout(resolve, 500)
  })

  return <p>This is about Next.js!</p>
}
