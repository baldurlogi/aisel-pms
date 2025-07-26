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
        project: ['./tsconfig.eslint.json'],
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
      'import/resolver': {
        typescript: {
          project: [
            './tsconfig.eslint.json',
            './apps/web/tsconfig.json',
            './apps/api/tsconfig.json',
          ],
        },
      },
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

      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // Jest / vitest tests
  {
    files: ['**/*.test.{ts,tsx,js,jsx}'],
    languageOptions: { globals: { jest: 'readonly', vi: 'readonly' } },
  },
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/coverage-e2e/**',
      '**/lcov-report/**',
      'prisma.config.mjs',
      '**/.next/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
    },
  },
  {
    files: ['apps/api/src/**/*.ts'],
    rules: {
      'n/no-extraneous-import': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['apps/api/src/patients/patients.controller.ts', 'apps/web/src/components/PatientsList.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
