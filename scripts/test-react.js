// Installs dependencies and runs the src test suite against each React version
// defined in test/react/<version>.
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const reactDir = path.join(process.cwd(), 'test', 'react')

const versions = fs
  .readdirSync(reactDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) =>
    fs.existsSync(path.join(reactDir, entry.name, 'package.json')),
  )
  .map((entry) => entry.name)
  .sort()

for (const version of versions) {
  const dir = path.join(reactDir, version)

  console.log(`Starting React ${version} tests`)

  execSync('npm i --no-package-lock --quiet --no-progress', {
    cwd: dir,
    stdio: 'inherit',
  })

  try {
    execSync(
      `REACT_VERSION=${version} npx jest --config ./scripts/jest/config.src.js --coverage false`,
      { stdio: 'inherit' },
    )
  } catch {
    console.error(`Fail testing React ${version}`)
    process.exit(1)
  }

  console.log(`Success testing React ${version}`)
}
