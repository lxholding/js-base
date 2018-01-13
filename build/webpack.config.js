const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const webpackMerge = require('webpack-merge');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const webpackConfig = webpackMerge(baseConfig, {
  devtool: build.devtool,
  entry: {
    www: [`${build.srcPath}/entry/www`],
    websocket: [`${build.srcPath}/entry/websocket`],
    // wap: [`${build.srcPath}/entry/wap`],
    vendor: ['axios', 'vue', 'vue-router', 'vuex']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css'
    }),
    new FriendlyErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'www',
      hash: false,
      cache: true,
      filename: `${build.outputPath}/index.html`,
      template: `${build.srcPath}/entry/www/template.html`,
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        removeAttributeQuotes: true // 移除属性引号
      },
      chunksSortMode: 'dependency',
      chunks: ['vendor', 'www']
    }),
    new HtmlWebpackPlugin({
      title: 'WebSocket',
      hash: false,
      cache: true,
      filename: `${build.outputPath}/websocket.html`,
      template: `${build.srcPath}/entry/websocket/template.html`,
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        removeAttributeQuotes: true // 移除属性引号
      },
      chunksSortMode: 'dependency',
      chunks: ['vendor', 'websocket']
    }),
    // new HtmlWebpackPlugin({
    //   title: 'wap',
    //   hash: false,
    //   cache: true,
    //   filename: `${build.outputPath}/wap.html`,
    //   template: `${build.srcPath}/entry/www/template.html`,
    //   minify: { //压缩HTML文件
    //     removeComments: true, //移除HTML中的注释
    //     collapseWhitespace: true, //删除空白符与换行符
    //     removeAttributeQuotes: true //移除属性引号
    //   },
    //   chunksSortMode: 'dependency',
    //   chunks: ['vendor', 'wap']
    // }),
  ]
});

// 是否压缩js
if (build.compress.js) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: build.sourceMap
  }));
}

// 是否压缩css
if (build.compress.css) {
  const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
  webpackConfig.plugins.push(
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        },
        safe: true
      }
    }));
}

console.log(`isArray:${Array.isArray(build.compress.gzipExtensions)}`);

// 是否直接生成gz文件
if (build.compress.gzipExtensions && build.compress.gzipExtensions.length) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  webpackConfig.plugins.push(new CompressionWebpackPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp(`\\.(${build.compress.gzipExtensions.join('|')})$`),
    threshold: 10240,
    minRatio: 0.8
  }));
}

if (build.analyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
