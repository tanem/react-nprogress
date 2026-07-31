// Runs arethetypeswrong against the tarball npm would publish.
//
// attw's own --pack flag shells out to `npm pack`, which runs the prepare
// script, which runs the build, whose postbuild hook runs this check again:
// an infinite loop. Packing here with --ignore-scripts breaks it. dist/ is
// expected to already exist, which is why the check is a postbuild hook.
const { execSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const packDir = fs.mkdtempSync(path.join(os.tmpdir(), 'attw-'))

let failed = false

try {
  const [{ filename }] = JSON.parse(
    execSync(`npm pack --ignore-scripts --json --pack-destination ${packDir}`, {
      encoding: 'utf8',
    }),
  )

  execSync(`npx attw ${path.join(packDir, filename)}`, { stdio: 'inherit' })
} catch {
  failed = true
} finally {
  fs.rmSync(packDir, { force: true, recursive: true })
}

if (failed) {
  process.exit(1)
}
