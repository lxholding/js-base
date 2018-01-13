// webpack配置文件
const config = require(process.env.CONFIG_FILE);

console.log('dev server config:', context.devServer);

module.exports = (app, cb) => {
  // 加载模式服务文件
  require(`./server-dev-${context.devServer.mode}`)(app, cb, config, context);
  // 加载路由配置
  require(`./route/index`)(app);
};
