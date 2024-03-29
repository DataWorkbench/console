const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const WebpackBar = require('webpackbar')
const path = require('path')
const dotenv = require('dotenv')
const CopyWebpackPlugin = require('copy-webpack-plugin')

dotenv.config()

const resolve = (dir) => path.join(__dirname, dir)
const { NODE_ENV } = process.env
const envConfigPath = {
  qa: resolve('./env/.env.qa'),
  test: resolve('./env/.env.test'),
}

// dotenv.config({
//   path: envConfigPath[process.env.CURRENT_ENV],
// })

const isDev = process.env.NODE_ENV !== 'production'
const apiUrl = process.env.PROXY_API_URL || 'http://localhost:8888'

let config = {
  mode: NODE_ENV,
  target: 'web',
  entry: {
    main: './src/index.tsx',
  },
  output: {
    path: resolve('dist'),
    publicPath: '/dataomnis/',
    filename: `static/js/[name]${isDev ? '' : '.[contenthash:7]'}.js`,
    chunkFilename: `static/js/[name]${isDev ? '' : '.[contenthash:7]'}.js`,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use:[
          {
            loader:'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              sourceMaps: true,
              inputSourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: (url) => !url.includes('helpcenter/bg.svg'),
            },
          },
        ],
      },
      {
        test: /\.tpl$/,
        use: [
          {loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              sourceMaps: true,
              inputSourceMap: true,
            }
          },
          {loader: resolve('./loaders/tpl-loader.js'), options: {
               tplValue: { ...process.env },
            }},
        ]
      },
      {
        test: /\.svg$/i,
        oneOf: [
          {
            include: resolve('src/assets/icons'),
            use: [
              {
                loader: 'svg-sprite-loader',
                options: {
                  symbolId: 'bdicon-[name]',
                },
              },
              {
                loader: 'svgo-loader',
              },
            ],
          },
          {
            include: resolve('src/assets/svgr'),
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  svgo: true,
                  svgoConfig: {
                    plugins: [{ name: 'preset-default' }],
                  },
                },
              },
            ],
          },
          {
            // type: 'asset/resource',
            type: 'asset',
            generator: {
              filename: 'static/imgs/[hash][ext][query]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        exclude: resolve('src/assets/icons'),
        generator: {
          filename: 'static/imgs/[hash][ext][query]',
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
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [resolve('src'), 'node_modules'],
    alias: {
      components: resolve('src/components'),
      views: resolve('src/views'),
      stores: resolve('src/stores'),
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
    host: '0.0.0.0',
    allowedHosts: ['local.testing.com', 'local.qacloud.com', 'local.test.data.qingcloud.link'],
    compress: true,
    hot: true,
    historyApiFallback: {
      index: '/dataomnis/index.html',
    },
    devMiddleware: {},
    static: {},
    client: {
      logging: 'info',
      progress: true,
    },
    proxy: {
      '/global_api': {
        target: apiUrl,
        changeOrigin: true,
      },
      '/*_api': {
        target: apiUrl,
        changeOrigin: true,
      },
      '/api': {
        target: apiUrl,
        changeOrigin: true,
      },
      '/login': {
        target: apiUrl,
        changeOrigin: true,
      },
      '/static': {
        target: apiUrl,
        changeOrigin: true,
      },
      '/captcha': {
        target: apiUrl,
        changeOrigin: true,
      },
    },
  },
  cache: {
      // 磁盘存储
      type: "filesystem",
      buildDependencies: {
        // 当配置修改时，缓存失效
        config: [__filename]
      }
    },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, 'favicon.ico'),
      filename: 'index.html',
      inject: false,
      template: path.resolve(__dirname, 'index.html'),
    }),
    new WebpackBar({
      name: NODE_ENV,
      color: 'green',
      profile: !isDev,
    }),
    new MonacoWebpackPlugin({
      languages: ['json', 'sql', 'python', 'scala'],
      filename: 'static/js/[name].worker.js',
    }),
  ].filter(Boolean),
}

if (process.env.npm_config_report) {
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 3002 }))
}
if (isDev) {
  config = merge(config, {
    devtool: 'eval-source-map',
    plugins: [new ReactRefreshWebpackPlugin({ overlay: false })],
  })
} else {
  config = merge(config, {
    plugins: [
      new CopyWebpackPlugin({patterns:[
          {
            from: ('./config.js'),
            to: ('./static/js/config.js'),
          }
        ]}),
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
