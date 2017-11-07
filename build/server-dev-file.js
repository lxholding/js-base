const fs = require('fs')
const express = require('express')
const httpProxy = require('http-proxy')
const compression = require('compression')
const webpack = require('webpack')
const proxy = httpProxy.createProxyServer()

module.exports = (app, cb, config) => {
    // config.output.filename = '[name].js'
    config.plugins.push(
        new webpack.NoEmitOnErrorsPlugin()
    )

    app.use(compression({
        level: 1,
        threshold: 1024
    }))

    //代理错误处理
    proxy.on('error', function(err, req, res){
        res.writeHead(500, {
            'content-type': 'text/plain;charset=utf-8'
        })
        console.log(err)
        res.end(`代理错误:${err}`)
    })

    //拦截请求转发到代理
    app.use(function (req, res, next) {
        console.log('req: %@', req)
        let headers = req.headers
        let host = req.hostname
        let url = req.originalUrl
        let urlPath = req.path
        let file = `${config.output.path}${urlPath}`

        console.log(`request host:${host} url:${url} path:${urlPath} file:${file}`)
        if (fs.existsSync(file)) { //文件存在不走代理
            next()
        } else {
            switch (host) {
                case 'local.scentonly.com':
                    {
                        console.log(`proxy host:${host} url:${url} path:${urlPath} file:${file}`)
                        proxy.web(req, res, {
                            target: 'http://127.0.0.1:8181'
                        });
                    }
            }
        }
    })

    app.use(express.static(config.output.path))
}
