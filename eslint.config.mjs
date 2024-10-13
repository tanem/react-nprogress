import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  {
    ignores: ['**/compiled/', '**/coverage/', '**/dist/', '**/node_modules/'],
  },
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ),
  {
    languageOptions: {
      ecmaVersion: 5,
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: path.join(__dirname, 'tsconfig.eslint.json'),
      },
      sourceType: 'module',
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-sort-props': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      'sort-keys': 'error',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['examples/**/*'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['jsx'],
        },
      ],
      'react/prop-types': 'off',
    },
  },
]
