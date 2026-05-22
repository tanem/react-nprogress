import path from 'node:path'
import { fileURLToPath } from 'node:url'

import js from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default tseslint.config(
  {
    ignores: ['**/compiled/', '**/coverage/', '**/dist/', '**/node_modules/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintReact.configs['recommended-typescript'],
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: path.join(__dirname, 'tsconfig.eslint.json'),
      },
    },

    plugins: {
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      // Hooks are linted by the official eslint-plugin-react-hooks (React team);
      // disable @eslint-react's overlapping ports to avoid double-linting.
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      'sort-keys': 'error',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['examples/plain-js/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['examples/**/*'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
)
