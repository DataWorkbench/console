const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss',
    'postcss-nested',
    !isDev && 'autoprefixer',
  ].filter(Boolean),
}
