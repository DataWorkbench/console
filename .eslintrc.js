module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    // 'prettier',
    'plugin:prettier/recommended'
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'es2020',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@emotion', 'jest', '@typescript-eslint'],
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/forbid-prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/static-property-placement': [2, 'static public field'],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-named-as-defaul': 0
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': [
      'node',
      {
        webpack: {
          config: 'webpack.config.js'
        }
      }
    ]
  },
  globals: {
    _: true,
    T: true,
    TH: true,
    CONFIG: true,
    USER: true,
    GLOBAL_CONFIG: true,
    EMITTER: true,
    getText: true
  }
}
