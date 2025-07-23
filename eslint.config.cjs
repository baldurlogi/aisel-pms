const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const imp = require('eslint-plugin-import');
const n = require('eslint-plugin-n');
const prettier = require('eslint-plugin-prettier');

/** @type {import('eslint').FlatConfig[]} */
module.exports = [
  // --------------------------------------------------
  // TypeScript + React
  // --------------------------------------------------
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      react,
      'react-hooks': reactHooks,
      import: imp,
      n,
      prettier,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: {} },
    },
    rules: {
      ...ts.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...imp.configs.recommended.rules,
      ...n.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/prop-types': 'off',
    },
  },
  // Jest / vitest tests
  {
    files: ['**/*.test.{ts,tsx,js,jsx}'],
    languageOptions: { globals: { jest: 'readonly', vi: 'readonly' } },
  },
];
