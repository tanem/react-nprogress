import fs from 'fs'
import path from 'path'

const distDir = path.join(process.cwd(), 'dist')

// The package is client-only, so every published module a bundler can resolve
// has to carry the `"use client"` marker. UMD bundles are excluded: they are
// script-tag targets that never enter a server/client module graph.
//
// Deliberately derived from what is in `dist`, not from a hard-coded list of
// bundle names, so the assertions hold whichever tool produces the bundles.
const publishedModules = fs
  .readdirSync(distDir)
  .filter((file) => file.endsWith('.js') && !file.includes('.umd.'))

describe('published modules', () => {
  it('should be present', () => {
    expect(publishedModules.length).toBeGreaterThan(0)
  })

  it.each(publishedModules)(
    '%s should start with the "use client" directive',
    (module) => {
      const contents = fs.readFileSync(path.join(distDir, module), 'utf8')
      expect(contents).toMatch(/^["']use client["']/)
    },
  )
})
