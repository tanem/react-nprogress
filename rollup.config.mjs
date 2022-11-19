import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import sourcemaps from 'rollup-plugin-sourcemaps'

import pkg from './package.json' assert { type: 'json' }

const CJS_DEV = 'CJS_DEV'
const CJS_PROD = 'CJS_PROD'
const ES = 'ES'
const UMD_DEV = 'UMD_DEV'
const UMD_PROD = 'UMD_PROD'

const input = './compiled/index.js'
const exports = 'named'

const getExternal = (bundleType) => {
  const peerDependencies = Object.keys(pkg.peerDependencies)
  const dependencies = Object.keys(pkg.dependencies)

  // Hat-tip: https://github.com/rollup/rollup-plugin-babel/issues/148#issuecomment-399696316.
  const makeExternalPredicate = (externals) => {
    if (externals.length === 0) {
      return () => false
    }
    const pattern = new RegExp(`^(${externals.join('|')})($|/)`)
    return (id) => pattern.test(id)
  }

  switch (bundleType) {
    case CJS_DEV:
    case CJS_PROD:
    case ES:
      return makeExternalPredicate([...peerDependencies, ...dependencies])
    default:
      return makeExternalPredicate(peerDependencies)
  }
}

const isProduction = (bundleType) =>
  bundleType === CJS_PROD || bundleType === UMD_PROD

const getBabelConfig = () => ({
  babelHelpers: 'runtime',
  babelrc: false,
  exclude: 'node_modules/**',
  plugins: ['@babel/transform-runtime'],
  presets: [['@babel/env', { loose: true, modules: false }], '@babel/react'],
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
      isProduction(bundleType) ? 'production' : 'development'
    ),
  }),
  sourcemaps(),
  isProduction(bundleType) &&
    terser({
      compress: {
        keep_infinity: true,
        pure_getters: true,
      },
      ecma: 5,
      output: { comments: false },
      toplevel: false,
      warnings: true,
    }),
]

const getCjsConfig = (bundleType) => ({
  external: getExternal(bundleType),
  input,
  output: {
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
  external: getExternal(ES),
  input,
  output: {
    exports,
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  },
  plugins: getPlugins(ES),
})

const getUmdConfig = (bundleType) => ({
  external: getExternal(bundleType),
  input,
  output: {
    exports,
    file: `dist/react-nprogress.umd.${
      isProduction(bundleType) ? 'production' : 'development'
    }.js`,
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    name: 'NProgress',
    sourcemap: true,
  },
  plugins: getPlugins(bundleType),
})

export default [
  getCjsConfig(CJS_DEV),
  getCjsConfig(CJS_PROD),
  getEsConfig(),
  getUmdConfig(UMD_DEV),
  getUmdConfig(UMD_PROD),
]
