// Suppresses the "wrong act()" console.error warnings that
// @testing-library/react-hooks emits on React 16 and 17. The package uses
// react-test-renderer internally while state updates flow through react-dom,
// triggering a harmless mismatch warning.
const originalError = console.error

console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes("It looks like you're using the wrong act()")
  ) {
    return
  }
  originalError.call(console, ...args)
}
