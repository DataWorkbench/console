const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
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
    publicPath: '/',
    filename: `static/js/[name]${isDev ? '' : '.[contenthash:7]'}.js`,
    chunkFilename: `static/js/[name]${isDev ? '' : '.[contenthash:7]'}.js`,
    pathinfo: false,
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
          'postcss-loader',
          // {
          //   loader: 'sass-loader',
          //   options: {
          //     sourceMap: false,
          //     webpackImporter: true,
          //   },
          // },
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
          filename: 'imgs/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [resolve('src'), 'node_modules'],
    symlinks: false,
    alias: {
      components: resolve('src/components'),
      views: resolve('src/views'),
      stores: resolve('src/stores'),
      scss: resolve('src/scss'),
      react: resolve('node_modules/react'),
      asserts: resolve('src/assets'),
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
    overlay: true,
    inline: true,
    compress: true,
    historyApiFallback: true,
    proxy: {
      '/*_api': {
        target: 'http://localhost:8888',
        // changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8888',
        // changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:8888',
        // changeOrigin: true,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
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
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css',
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
            priority: -10,
            test: /[\\/]node_modules[\\/]/,
          },
          default: {
            name: 'common',
            chunks: 'initial',
            minChunks: 2,
            priority: -20,
          },
        },
      },
    },
  })
}

module.exports = config
