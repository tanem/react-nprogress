'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-nprogress.production.min.js')
} else {
  module.exports = require('./cjs/react-nprogress.development.js')
}
