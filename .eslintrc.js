module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'prettier', 'validate-filename'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'error',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-explicit-any': 'warning',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allows you to skip explicit return types in TypeScript
    'react/jsx-filename-extension': [1, {extensions: ['.tsx']}], // Only .tsx files for JSX
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'import/no-unresolved': 'off', // TypeScript takes care of this
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    'react/jsx-props-no-spreading': 'off', // Allowing spread props
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/prefer-default-export': 'off',
    'validate-filename/naming-rules': [
      'error',
      {
        rules: [
          {
            case: 'pascal',
            target: '**/layouts/**',
          },
          {
            case: 'pascal',
            target: '**/interfaces/**',
            patterns: '.interface.ts$',
          },
          {
            case: 'kebab',
            target: '**/app/**',
            patterns: '^(page|layout|loading|error|not-found|route|template).tsx$',
          },
          {
            case: 'camel',
            target: '**/hooks/**',
            patterns: '^use',
          },
        ],
      },
    ],
  },
};
