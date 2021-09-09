const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const WebpackBar = require('webpackbar')
const path = require('path')

const resolve = (dir) => path.join(__dirname, dir)
const { NODE_ENV } = process.env
const isDev = process.env.NODE_ENV !== 'production'

let config = {
  mode: NODE_ENV,
  target: 'web',
  entry: {
    main: './src/index.jsx',
  },
  output: {
    path: resolve('dist'),
    publicPath: '/bigdata/',
    filename: `static/js/[name]${isDev ? '' : '.[contenthash:7]'}.js`,
    chunkFilename: `static/js/[name]${isDev ? '' : '.[contenthash:7]'}.js`,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isDev
                  ? '[local]-[hash:base64:5]'
                  : '[hash:base64]',
              },
              sourceMap: isDev,
              url: (url) => {
                if (url.includes('helpcenter/bg.svg')) {
                  return false
                }
                return true
              },
            },
          },
          // 'postcss-loader',
        ],
      },
      {
        test: /\.svg$/i,
        include: resolve('src/assets/icons'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'bdicon-[name]',
            },
          },
          { loader: 'svgo-loader', options: {} },
        ],
      },
      {
        test: /\.(png|jpg|svg|jpeg|gif)$/i,
        type: 'asset/resource',
        exclude: resolve('src/assets/icons'),
        generator: {
          filename: 'static/imgs/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [resolve('src'), 'node_modules'],
    // symlinks: false,
    alias: {
      components: resolve('src/components'),
      views: resolve('src/views'),
      stores: resolve('src/stores'),
      scss: resolve('src/scss'),
      react: resolve('node_modules/react'),
      'react-router-dom': resolve('node_modules/react-router-dom'),
      asserts: resolve('src/assets'),
      hooks: resolve('src/hooks'),
      utils: resolve('src/utils'),
      contexts: resolve('src/contexts'),
    },
  },
  stats: {
    assetsSort: '!size',
    warnings: true,
    errorDetails: true,
  },
  optimization: {},
  devServer: {
    host: 'localhost',
    hot: true,
    historyApiFallback: {
      index: '/bigdata/index.html',
      // verbose: true,
    },
    devMiddleware: {},
    static: {},
    client: {
      logging: 'info',
      overlay: true,
      progress: true,
    },
    proxy: {
      '/*_api': {
        target: 'http://localhost:8888',
      },
      '/api': {
        target: 'http://localhost:8888',
      },
      '/login': {
        target: 'http://localhost:8888',
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: false,
      template: path.resolve(__dirname, 'index.html'),
    }),
    new WebpackBar({
      name: NODE_ENV,
      color: 'green',
      profile: !isDev,
    }),
  ].filter(Boolean),
}

if (process.env.npm_config_report) {
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 3002 }))
}
if (isDev) {
  config = merge(config, {
    devtool: 'eval-cheap-module-source-map',
    plugins: [new ReactRefreshWebpackPlugin({ overlay: false })],
  })
} else {
  config = merge(config, {
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:7].css',
        chunkFilename: 'static/css/[id].[contenthash:7].css',
      }),
    ],
    optimization: {
      minimizer: [`...`, new CssMinimizerPlugin()],
      splitChunks: {
        chunks: 'all',
        minChunks: 1,
        cacheGroups: {
          vendors: {
            chunks: 'initial',
            name: 'vendor',
            minChunks: 1,
            priority: 3,
            test: /[\\/]node_modules[\\/].*\.js$/,
          },
          'async-vendors': {
            chunks: 'async',
            minChunks: 1,
            name: 'async-vendors',
            priority: 2,
            test: /[\\/]node_modules[\\/].*\.js$/,
          },
          'css-vendor': {
            chunks: 'all',
            test: /[\\/]node_modules[\\/].*\.css$/,
            name: 'css-vendor',
            minChunks: 1,
            priority: 3,
          },
          styles: {
            type: 'css/mini-extract',
            enforce: true,
            name: 'main',
            minChunks: 1,
            priority: 1,
          },
          default: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            priority: 1,
          },
        },
      },
    },
  })
}

module.exports = config
