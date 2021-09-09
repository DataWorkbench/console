module.exports = (api) => {
  const isTest = api.env('test')
  api.cache.forever()
  return {
    presets: [
      [
        '@babel/env',
        isTest
          ? {
              targets: {
                node: 'current',
              },
            }
          : {
              useBuiltIns: 'usage',
              corejs: '3.13.1',
              loose: true,
              modules: false,
            },
      ],
      [
        '@babel/preset-react',
        { runtime: 'automatic', importSource: '@emotion/react' },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      '@emotion',
      'babel-plugin-twin',
      'babel-plugin-macros',
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      // ['lodash'],
    ],
    env: {
      development: {
        plugins: [['react-refresh/babel']],
      },
    },
  }
}
