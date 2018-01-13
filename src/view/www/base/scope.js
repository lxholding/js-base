export default () => {
  this.moduleExportScopeAttr = 'module export scope';
  const parentScopeVar = 'parent scope';
  function F(a) {
    console.info('函数没有this:', this);
    const b = a;
    function F2() {
      const c = 2;
      console.info(`a:${a} b:${b} c:${c}`);
    }

    console.info(`a:${a} b:${b}`);
    F2();
  }
  F(1);

  // 立即执行函数表达式，写法1
  (function foo(a) {
    console.info(parentScopeVar);
    console.info(a);
    console.info('严格模式下函数没有this:', this);
    if (a < 2) {
      foo(a + 1);
    }
  })(1);

  // 立即执行函数表达式，写法2
  (function foo(a) {
    console.info(parentScopeVar);
    console.info(a);
    console.info('严格模式下函数没有this:', this);
    if (a < 2) {
      foo(a + 1);
    }
  })(1);

  // 匿名函数无法调用自身
  ((a) => {
    console.info(parentScopeVar);
    console.info(this.moduleExportScopeAttr);
    console.info(a);
    console.info('剪头函数this为外层作用域的this:', this);
  })(1);

  // 防止undefined被错误覆盖
  /* eslint no-shadow-restricted-names:"off" */
  /* eslint no-unused-vars:"off" */
  const undefined = true;
  /* eslint no-shadow:"off" */
  (function IIFE(undefined) {
    if (!undefined) {
      console.info('undefined 在这里是安全的');
    }
  })();

  for (let i = 0; i < 10; i += 1) {
    console.info(`i:${i}`);
  }
  /* eslint no-undef:"off" */
  try {
    console.info(global);
    console.info(i);
  } catch (error) {
    console.info('使用let定义的变量具有块作用域特性', error);
  }

  // 块作用域变量
  const run = true;
  if (run) {
    {
      const bar = 10;
      console.info(`块作用域变量${bar}`, this);
    }
  }

  // 函数表达式只能在函数体中访问
  var today = function todayFunc() {
    console.info(`todayFunc:${String(todayFunc)}`);
  };
  today();
  try {
    console.info(`todayFunc:${todayFunc}`);
  } catch (error) {
    console.error('函数表达式只能在自己的作用域中访问', error);
  }

  console.group('函数变量提升');
  console.info(bfa);
  /* eslint no-use-before-define:off */
  bfa = 2;
  /* eslint vars-on-top:off */
  /* eslint no-var:off */
  var bfa;
  console.info(`a:${bfa}`);

  // 函数声明提升
  foo();
  function foo() {
    console.info(a);
    var a = 2;
  }

  // 当变量和函数重名时函数提升优先于变量，
  fooo();
  console.info(`fooo:${String(fooo)}`);
  var fooo;

  function fooo() {
    console.info('函数提升优先于变量 函数fooo');
  }

  fooo = function fooo() {
    console.info('fooo函数表达式');
  };
  console.info(`fooo:${String(fooo)}`);
  fooo();

  // 虽然变量foo2声明提升，但是因为赋值在后所以报错
  try {
    foo2();
  } catch (error) {
    console.error('虽然变量foo2声明提升，但是因为赋值在后所以报错', error);
  }
  let foo2 = function foo2() {
    var a = 2;
    console.info(a);
  };

  // 函数声明优先于变量声明
  foo3();
  // 同名变量声明会被函数声明覆盖
  var foo3;

  foo3 = function foo3() {
    console.info('foo3 2');
  };

  /* eslint no-redeclare:off */
  function foo3() {
    console.info('foo3 1');
  }

  // 后面的函数声明会覆盖前面的函数声明
  /* eslint no-redeclare:off */
  function foo3() {
    console.info('foo3 3');
  }

  console.groupEnd();

  console.group('作用域闭包');
  function foooo() {
    var a = 2;
    function bar() {
      console.info(`bar闭包持有所在作用域的引用，所以可以访问外部作用域的变量 a:${a} parentScopeVar:${parentScopeVar}`);
    }

    // bar持有内部作用域的引用，因此作用域并不会回收，这个引用就是闭包!
    return bar;
  }
  // 获取bar的引用
  var fooooFunc = foooo();
  fooooFunc();

  var i = 99;
  // 循环和闭包
  (() => {
    for (var i = 1; i < 6; i++) {
      /* eslint no-loop-func:off */
      setTimeout(() => {
        console.info(`循环闭包错误示例 i=${i}`);
      }, i * 1000);
    }
    /* eslint block-scoped-var:off */
    console.info(`循环闭包错误示例结束  作用域i=${i}`);
  })();
  console.info(`模块作用域 i:${i}`);

  (() => {
    for (var i = 1; i < 6; i++) {
      ((oi) => {
        var j = i;
        /* eslint no-loop-func:off */
        setTimeout(() => {
          console.info(`循环闭包正确示例 i=${j} oi=${oi}`);
        }, (i + 5) * 1000);
      })(i);
    }
  })();

  // funcScope只是一个函数，必须要通过调用它来创建一个模块实例。如果不执行 外部函数，内部作用域和闭包都无法被创建
  var funcScope = (i) => {
    setTimeout(() => {
      debugger;
      console.info(`循环闭包正确示例2 i=${i}`);
    }, (i + 5) * 1000);
  };
  for (var i = 1; i < 6; i++) {
    funcScope(i);
  }

  for (var i = 1; i < 6; i++) {
    const j = i;
    setTimeout(() => {
      console.info(`循环闭包let示例1 i=${j}`);
    }, (i + 5) * 1000);
  }

  for (let i = 1; i < 6; i++) {
    setTimeout(() => {
      console.info(`循环闭包let示例2 i=${i}`);
    }, (i + 5) * 1000);
  }

  // 模块
  function Module(module) {
    var a = 1;
    var another = [1, 2, 3];

    function f1() {
      console.info(`${module} f1 a:${a}`);
    }

    function f2() {
      console.info(`${module} f2 another:${another.join('!')}`);
    }

    function aUp() {
      a++;
    }

    return {
      f1,
      f2,
      aUp
    };
  }

  // 每次调用函数都会创建新的作用域module1和module2是独立的互不影响
  var module1 = Module('module1');
  module1.f1();
  module1.f2();
  module1.aUp();
  module1.f1();

  var module2 = Module('module2');
  module2.f1();
  module2.f2();

  // 函数表达式也一样
  const ModuleExpress = function ModuleExpress(name) {
    var a = 1;

    return {
      show() {
        console.info(`${name} 变量a:${a}`);
      },
      up() {
        a++;
      }
    };
  };

  const module2Ins1 = ModuleExpress('ModuleExpress1');
  module2Ins1.up();
  module2Ins1.show();

  const module2Ins2 = ModuleExpress('ModuleExpress2');
  module2Ins2.show();

  console.groupEnd();

  // 函数参数优先级
  var param = 0;
  function foo4(param) {
    // 参数声明的优先级高于内部变量，因此会忽略内部同名变量的声明
    console.info(`param:${param}`);
    var param = 2;
    // 但是函数声明优先级高于参数
    function param() {}
  }
  foo4(1);
};
