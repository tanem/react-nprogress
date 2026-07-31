import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // CodeSandbox serves the dev server from a generated *.csb.app hostname.
  // Next only trusts localhost and LAN addresses by default, so without this
  // the sandbox preview never finishes hydrating: <Link> stays an inert <a>,
  // every click becomes a full page load, and the progress bar never runs.
  allowedDevOrigins: ['*.csb.app'],
}

export default nextConfig
