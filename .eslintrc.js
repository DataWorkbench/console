module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'react/forbid-prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react/static-property-placement': [2, 'static public field'],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
  settings: {
    'import/resolver': [
      'node',
      {
        webpack: {
          config: 'webpack.config.js',
        },
      },
    ],
  },
  globals: {
    _: true,
    T: true,
    TH: true,
    CONFIG: true,
    USER: true,
    GLOBAL_CONFIG: true,
    EMITTER: true,
    getText: true,
  },
}
