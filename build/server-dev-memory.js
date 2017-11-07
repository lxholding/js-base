const path = require('path')
const httpProxy = require('http-proxy')
const express = require('express')
const compression = require('compression')
const webpackDevMiddleWare = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const proxy = httpProxy.createProxyServer()

module.exports = (app, cb, webpackConfig, context) => {
  let bundle, template

  //设置热加载入口文件配置
  var devClient = './build/dev-client'
  Object.keys(webpackConfig.entry).forEach(function(name, i) {
    var extras = [devClient]
    webpackConfig.entry[name] = extras.concat(webpackConfig.entry[name])
  })

  //热加载配置
  webpackConfig.output.filename = '[name].js'
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin())

  const compiler = webpack(webpackConfig)
  const devMiddleware = webpackDevMiddleWare(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false // 是否显示chunks详情
    }
  })
  let hotMiddleWare = webpackHotMiddleware(compiler)

  //压缩
  app.use(
    compression({
      level: 1,
      threshold: 1024
    })
  )

  //代理错误处理
  proxy.on('error', function(err, req, res) {
    res.writeHead(500, {
      'content-type': 'text/plain;charset=utf-8'
    })
    console.log(err)
    res.end(`代理错误:${err}`)
  })

  //代理设置
  app.use(function(req, res, next) {
    // console.log('req: %@', req)
    let headers = req.headers
    let host = req.hostname
    let url = req.originalUrl
    let path = req.path
    let file = `${webpackConfig.output.path}${path}`
    const mfs = devMiddleware.fileSystem

    console.log(`proxy host:${host} url:${url} path:${path} file:${file}`)
    if (path == '/favicon.ico') {
      res.status(200).end()
    } else {
      next()
    }
  })

  app.use(devMiddleware)
  app.use(hotMiddleWare)

  devMiddleware.waitUntilValid(() => {
    cb()
  })
}
