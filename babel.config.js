module.exports = (api) => {
  api.cache.forever()
  return {
    presets: [
      [
        '@babel/env',
        {
          useBuiltIns: 'usage',
          corejs: '3.13.1',
          loose: true,
          modules: false,
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
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
