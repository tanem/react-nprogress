import NavigationProgress from '../components/NavigationProgress'
import ProgressLink from '../components/ProgressLink'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavigationProgress>
          <nav>
            <ProgressLink href="/" style={{ marginRight: 10 }}>
              Home
            </ProgressLink>
            <ProgressLink href="/about" style={{ marginRight: 10 }}>
              About
            </ProgressLink>
            <ProgressLink href="/forever" style={{ marginRight: 10 }}>
              Forever
            </ProgressLink>
            <a href="/non-existing">Non Existing Page</a>
          </nav>
          {children}
        </NavigationProgress>
      </body>
    </html>
  )
}
