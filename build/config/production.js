const merge = require('webpack-merge')
const env = require('./base')

module.exports = merge(env, {
  build: {
    compress: {
      js: true,
      css: true,
      gzipExtensions: ['js', 'css']
    }
  }
})
