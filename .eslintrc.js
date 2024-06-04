// ts-img
module.exports = {
  root: true,
  env: {
    browser: false,
    node: true,
    jest: true,
  },
  ignorePatterns: ['dist', 'node_modules'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'prettier', 'unicorn', 'import'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'off',
    'no-unused-vars': 'off',
    'no-fallthrough': 'off',
    'no-case-declarations': 'off',
    'no-constant-condition': 'off',
    'require-yield': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true,
      },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': false,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'local',
        varsIgnorePattern: '^_',
        args: 'none',

        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^ignore',
      },
    ],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-explicit-any': [
      'off',
      {
        ignoreRestArgs: true,
      },
    ],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: ['static-field', 'static-method', 'instance-field', 'constructor', 'instance-method'],
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': [
      'warn',
      {
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // TODO: Check if we want to enforce this
    '@typescript-eslint/ban-types': ['warn'],
    'no-inner-declarations': 'off',
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
      },
    ],
  },
};
