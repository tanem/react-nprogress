import fs from 'fs'
import path from 'path'

const distDir = path.join(process.cwd(), 'dist')

// The package is client-only, so every published module a bundler can resolve
// has to carry the `"use client"` marker.
//
// Deliberately derived from what is in `dist`, not from a hard-coded list of
// bundle names, so the assertions hold whichever tool produces the bundles.
const publishedModules = fs
  .readdirSync(distDir)
  .filter((file) => /\.[cm]?js$/.test(file))

// Derived the same way, and for the same reason, as `publishedModules`.
const declarationFiles = fs
  .readdirSync(distDir)
  .filter((file) => /\.d\.[cm]?ts$/.test(file))

// Consumers writing a typed wrapper around the hook or the render-props
// component need names for the option and return shapes, so both are part of
// the public API rather than internal declarations the bundler happened to
// inline.
const publicNames = [
  'NProgress',
  'NProgressOptions',
  'NProgressState',
  'useNProgress',
]

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

describe('declaration files', () => {
  it('should be present', () => {
    expect(declarationFiles.length).toBeGreaterThan(0)
  })

  it.each(declarationFiles)('%s should export the public API', (file) => {
    const contents = fs.readFileSync(path.join(distDir, file), 'utf8')
    const exported = (contents.match(/export\s*\{[^}]*\}/g) ?? []).join(' ')

    for (const name of publicNames) {
      expect(exported).toMatch(new RegExp(`\\b${name}\\b`))
    }
  })
})
