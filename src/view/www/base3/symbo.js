// 生成只有模块內才知道symbol作为key，外部无法修改
const FOO_KEY = Symbol('foo');

// 单例
function SingleInstance() {
  this.info = '使用Symbol在全局实现单例模式，并避免被覆盖';
  this.foo = `hello`;
}

// 设置全局唯一实例
if (!global[FOO_KEY]) {
  global[FOO_KEY] = new SingleInstance();
}

export default global[FOO_KEY];
