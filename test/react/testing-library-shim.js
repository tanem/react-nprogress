// Shim that provides a unified @testing-library/react interface for React
// versions where renderHook is not built into @testing-library/react (pre-v13).
// Re-exports everything from @testing-library/react and adds renderHook from
// the standalone @testing-library/react-hooks package.
//
// REACT_VERSION must be set so the shim can locate the correct version-specific
// node_modules directory.
const path = require('path')

const testDir = path.join(__dirname, process.env.REACT_VERSION)
const testingLibrary = require(
  require.resolve('@testing-library/react', { paths: [testDir] }),
)
const { renderHook } = require(
  require.resolve('@testing-library/react-hooks', { paths: [testDir] }),
)

module.exports = { ...testingLibrary, renderHook }
