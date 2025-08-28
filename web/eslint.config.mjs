import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import prettierPlugin from 'eslint-plugin-prettier'

const reactHooks = (reactHooksPlugin.default ?? reactHooksPlugin)
const reactRefresh = (reactRefreshPlugin.default ?? reactRefreshPlugin)
const prettier = (prettierPlugin.default ?? prettierPlugin)

export default tseslint.config(
  { ignores: ['dist'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': 'error',
    },
  }
)
