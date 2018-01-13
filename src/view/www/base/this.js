export default () => {
  /* eslint no-var:off */
  /* eslint no-unused-vars:off */
  var a = '全局变量a';
  function Foo(model, data) {
    /* eslint no-shadow:off */
    if (data) {
      this.a = data;
    }
    console.info(`Foo() ${model}:${this ? this.toString() : this} a:${this ? this.a : undefined}`);
    function bar(model) {
      console.info(`bar() this 只受执行时的上下文影响 ${model} this:${this ? this.toString() : this} a:${this ? this.a : undefined}`);
    }
    bar('默认绑定');
    bar.call(this, '显示绑定');
  }
  Foo('默认绑定 优先级最低');

  const obj = {
    a: 'obj 变量a',
    foo: Foo
  };

  const obj2 = {
    a: 'obj2 变量a'
  };

  const obj3 = {
    a: 'obj3 变量a'
  };

  obj.foo('隐式绑定');

  Foo.call(obj2, '显示绑定');
  obj.foo.call(obj2, '显示绑定优先级高于隐式绑定');

  const FooBind = Foo.bind(obj2, '硬绑定优先级高于显示绑定', '硬绑定变量a');
  FooBind.call(obj);

  function bindHelper(fn, obj) {
    return function bind(...args) {
      return fn.apply(obj, args);
    };
  }
  const fooBindHelper = bindHelper(Foo, obj3);
  fooBindHelper.call(obj, '自定义硬绑定');

  const newFoo = new FooBind('new绑定优先级最高', 'new 变量a');
  console.info(`new绑定优先级高于硬绑定 obj2.a=${obj2.a} newFoo.a=${newFoo.a}`);

  // 硬绑定实现柯里化
  function fooCurrying(p1, p2, p3) {
    this.val = `${p1}:${p2}:${p3}`;
  }

  const FooCurry = fooCurrying.bind(null, '固定参数p1');
  const fooCurryInstance = new FooCurry('剩余参数p2', '剩余参数p3');
  console.dir(fooCurryInstance);
  console.info(`fooCurryInstance.val:${fooCurryInstance.val}`);

  // 如果你把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值在调用时会被忽略，实际应用的是默认绑定规则
  function foo2(p1, p2, p3) {
    console.info(`p1:${p1} p2:${p2} p3:${p3}`);
  }
  // 把数组展开成参数
  foo2.apply(null, ['展开数组参数1', '展开数组参数2', '展开数组参数3']);
  let foo2Currying = foo2.bind(null, '柯里化固定参数1');
  foo2Currying('柯里化参数2', '柯里化参数3');

  // 当传入null或undefined时会使用默认绑定规则，在非严格模式下会绑定到window对象下造成污染，创建一个空对象作为绑定目标更安全
  const ø = Object.create(null);
  console.dir({});
  console.dir(ø);
  foo2.apply(ø, ['展开数组参数1', '展开数组参数2', '展开数组参数3']);
  foo2Currying = foo2.bind(ø, '柯里化固定参数1');
  foo2Currying('柯里化参数2', '柯里化参数3');

  // 软绑定实现
  if (!Function.prototype.softBind) {
    /* eslint no-extend-native:off */
    Function.prototype.softBind = function softBind(...args) {
      var fn = this;
      var obj = args[0];
      // 捕获所有 curried 参数
      var curried = [].slice.call(args, 1);
      console.info(`args:${args} curried:${curried}`);
      const bound = function bound(...args) {
        return fn.apply(
          // 当this undefined获取this等于全局根对象时，说明是函数直接调用，这时候使用指定对象作为上下文，否则说明有上下文，直接使用当前上下文
          (!this || this === (window || global)) ? obj : this,
          curried.concat(args),
        );
      };
      bound.prototype = Object.create(fn.prototype);
      return bound;
    };
  }

  // 软绑定实例
  function fooSoftBind(p1, p2) {
    console.info(`name:${this.name} p1:${p1} p2:${p2}`);
  }
  const obj4 = { name: 'obj4' };
  const obj5 = { name: 'obj5' };
  const obj6 = { name: 'obj6' };

  const fooSoftBindObj = fooSoftBind.softBind(obj4, 'p1默认值');
  fooSoftBindObj('p2参数');// 相当于硬绑定
  obj5.foo = fooSoftBind.softBind(obj4, 'p1默认值');
  obj5.foo('p2参数');// 相当于隐式绑定
  fooSoftBindObj.call(obj6, 'p2参数');// 相当于显示绑定
};
