const merge = require('webpack-merge');
const env = require('./base');

module.exports = merge(env, {
  build: {
    devtool: '#cheap-module-eval-source-map'
  }
});
