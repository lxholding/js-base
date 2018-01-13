const path = require('path');
const portfinder = require('portfinder');
const express = require('express');
const expressVersion = require('express/package.json').version;
const vueServerRenderVersion = require('vue-server-renderer/package.json').version;

const serverInfo = `express/${expressVersion} vue-server-renderer/${vueServerRenderVersion}`;
const app = express();
let mfs;
// http服务引用
let server;
// http服务准备完成promise
const readyPromise = {
  resolve: null,
  reject: null,
  promise: null,
  init() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
};

// 加载http服务配置
require(`./build/server-${process.env.NODE_ENV}`)(app, (bundle, template) => {
  // console.log(bundle, template)
  console.log(`> Starting ${process.env.NODE_ENV} server...`);
  readyPromise.init();

  // 获取可用端口
  const port = process.env.PORT || 8080;
  portfinder.basePort = port;
  portfinder.getPort((err, port) => {
    if (err) {
      readyPromise.reject(err);
    }
    const url = `http://0.0.0.0:${port}`;
    // 启动http服务
    server = app.listen(port, () => {
      console.log(`> Listening at ${url} \n`);
      readyPromise.resolve();
    });
  });
});

module.exports = {
  ready: readyPromise,
  close() {
    server.close;
  }
};
