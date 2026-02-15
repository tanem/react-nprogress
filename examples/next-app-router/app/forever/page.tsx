export default async function ForeverPage() {
  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })

  return <p>This page was rendered for a while!</p>
}
