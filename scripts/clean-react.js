// Cleans node_modules from each test/react/<version> directory while preserving
// the package.json file.
const fs = require('fs')
const os = require('os')
const path = require('path')

const reactDir = path.join(process.cwd(), 'test', 'react')

fs.readdirSync(reactDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .forEach((entry) => {
    const dir = path.join(reactDir, entry.name)
    const pkgJsonPath = path.join(dir, 'package.json')

    if (!fs.existsSync(pkgJsonPath)) {
      return
    }

    // Preserve package.json by copying to a temporary location.
    const tmpPath = path.join(os.tmpdir(), `${entry.name}-package.json`)
    fs.copyFileSync(pkgJsonPath, tmpPath)
    fs.rmSync(dir, { force: true, recursive: true })
    fs.mkdirSync(dir, { recursive: true })
    fs.copyFileSync(tmpPath, pkgJsonPath)
  })
