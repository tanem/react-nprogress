import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'

import pkg from './package.json' with { type: 'json' }

const CJS_DEV = 'CJS_DEV'
const CJS_PROD = 'CJS_PROD'
const ES = 'ES'

const input = './compiled/index.js'
const exports = 'named'

// Every export is or wraps a hook, and the timers run on
// `window.requestAnimationFrame`, so the package is client-only. Rollup strips
// file-level directives while bundling, so the marker is added as an output
// banner rather than in the source.
const banner = `'use client';`

// Every bundle is resolved by a bundler or by Node, so peers and dependencies
// are always left for the consumer to resolve.
// Hat-tip: https://github.com/rollup/rollup-plugin-babel/issues/148#issuecomment-399696316.
const external = (() => {
  const externals = [
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.dependencies),
  ]
  const pattern = new RegExp(`^(${externals.join('|')})($|/)`)
  return (id) => pattern.test(id)
})()

const isProduction = (bundleType) => bundleType === CJS_PROD

const getBabelConfig = () => ({
  babelHelpers: 'runtime',
  babelrc: false,
  exclude: 'node_modules/**',
  inputSourceMap: true,
  plugins: ['@babel/transform-runtime'],
  presets: [
    ['@babel/env', { modules: false }],
    ['@babel/react', { runtime: 'automatic' }],
  ],
})

const getPlugins = (bundleType) => [
  nodeResolve(),
  commonjs({
    include: 'node_modules/**',
  }),
  babel(getBabelConfig(bundleType)),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(
      isProduction(bundleType) ? 'production' : 'development',
    ),
  }),
  isProduction(bundleType) &&
    terser({
      compress: {
        // Terser treats `'use client'` as a non-standard directive and drops
        // it from the minified output unless directive removal is disabled.
        directives: false,
        keep_infinity: true,
        pure_getters: true,
      },
      output: { comments: false },
    }),
]

const getCjsConfig = (bundleType) => ({
  external,
  input,
  output: {
    banner,
    exports,
    file: `dist/react-nprogress.cjs.${
      isProduction(bundleType) ? 'production' : 'development'
    }.js`,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: getPlugins(bundleType),
})

const getEsConfig = () => ({
  external,
  input,
  output: {
    banner,
    exports,
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  },
  plugins: getPlugins(ES),
})

export default [getCjsConfig(CJS_DEV), getCjsConfig(CJS_PROD), getEsConfig()]
