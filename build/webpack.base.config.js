const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

// 根据环境变量加载环境配置文件
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
console.log('env:', process.env.NODE_ENV)
global.context = {
  config: require(`./config/${process.env.NODE_ENV}`),
  isDev: process.env.NODE_ENV != 'production',
  devServer: {
    mode: process.env.DEV_SERVER_MODE || 'memory'
  }
}
console.log('env config:', JSON.stringify(context))

// 路径设置
const rootPath = path.resolve(__dirname, '..')
const publicPath = '/'
const assetsPath = `${rootPath}/assets`
const srcPath = `${rootPath}/src`
const outputPath = `${rootPath}/dist/${process.env.NODE_ENV}`
const viewPath = `${srcPath}/view`

// 编译配置初始化
global.build = webpackMerge(context.config.build, {
  rootPath,
  publicPath,
  assetsPath,
  srcPath,
  outputPath,
  viewPath,
  // 展示构建分析报告
  analyzerReport: process.env.BUILD_ANALYZER_REPORT || false
})
console.log('build:', JSON.stringify(global.build))

// 删除运行环境无用配置
delete context.config.build

module.exports = {
  output: {
    path: outputPath,
    publicPath,
    filename: '[name].[chunkhash:8].js'
  },
  resolve: {
    extensions: ['.js', '.png', '.jpg', '.jpeg', '.gif', '.json', '.scss'],
    // enforceModuleExtension: false,
    alias: {
      app$: `${srcPath}/app`,
      view: `${viewPath}`,
      comp: `${srcPath}/component`,
      css: `${srcPath}/css`,
      filter: `${srcPath}/filter`,
      plugin: `${srcPath}/plugin`,
      assets: `${assetsPath}`
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [`${srcPath}`],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: false,
          loaders: {
            css: 'vue-style-loader!css-loader!sass-loader',
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      /* {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      }, */
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      ENV: JSON.stringify(context)
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
