export default () => {
  function foo() {}
  {
    if (typeof a === 'undefined') {
      console.info('块作用域', 'cool');
    }
    if (typeof b === 'undefined') {
      console.info('块作用域', '正常环境下应该抛出 ReferenceError');
    }
    const b = 2;
  }

  // 参数展开
  {
    function foo(x, y, z) {
      console.info('参数展开', x, y, z);
    }
    foo(...[1, 2, 3]);
    foo.apply(null, [1, 2, 3]);
    const a = [2, 3, 4];
    const b = [1, ...a, 5];
    console.info('参数展开', b);

    function foo2(x, y, ...z) {
      console.info('参数展开', x, y, z);
    }
    foo2(1, 2, 3, 4, 5);

    function foo3(...args) {
      console.info('参数展开', args);
    }
    foo3(1, 2, 3, 4, 5);
  }

  // 参数默认值
  {
    function foo(x = 11, y = 31) {
      console.info('参数默认值', x + y);
    }

    foo();
    foo(5, 6);
    foo(0, 42);

    foo(5);
    foo(5, undefined);
    foo(5, null);

    foo(undefined, 6);
    foo(null, 6);
  }

  // 参数默认值表达式
  {
    function bar(val) {
      return y + val;
    }
    function foo(x = y + 3, z = bar(x)) {
      console.info('默认参数值表达式', x, z);
    }

    var y = 5;
    foo();
    foo(10);
    y = 6;
    foo(undefined, 10);

    function foo2(x = (v => v + 11)(31)) {
      console.info('默认参数值立即函数', x);
    }
    foo2();

    function ajax(url, cb = (url) => {}) {
      console.info('默认参数值函数', url, cb(url));
    }
    ajax('url1');
    ajax('url2', url => `函数参数值:${url}`);
  }

  // 自动解构
  {
    function foo() {
      return [1, 2, 3];
    }
    function bar() {
      return {
        c: 99,
        x: 4,
        y: 5,
        z: 6
      };
    }

    const [a, b, c] = foo();
    const { c: e, x, y, z } = bar();
    console.info('数组自动解构', a, b, c);
    console.info('对象自动解构', e, x, y, z);

    // 注意解构和对象是反的，值在前变量名在后
    const aa = 10,
      bb = 20;
    const o = {
      x: aa,
      y: bb
    };
    let { x: AA, y: BB } = o;
    console.info('注意解构和对象是反的，值在前变量名在后', aa, bb, AA, BB);
    ({ AA, BB } = {
      AA: 1,
      BB: 2
    });
    console.info('重新赋值', AA, BB);

    let oo = {};
    [oo.a, oo.b, oo.c] = [1, 2, 3];
    ({ x: oo.d, y: oo.e, z: oo.f } = {
      x: 4,
      y: 5,
      z: 6
    });
    console.info('解构也可以复制给对象属性', oo);

    const which = 'x';
    oo = {};
    ({ [which]: oo[which] } = {
      a: 1,
      b: 2,
      x: 99
    });
    console.info('计算属性可以用于解构', oo);
  }

  // 解构使用技巧
  {
    // 对象解构到对象
    let o1 = {
        a: 1,
        b: 2,
        c: 3
      },
      o2 = {};
    ({ a: o2.x, b: o2.y, c: o2.z } = o1);
    console.info(o2.x, o2.y, o2.z); // 1 2 3

    // 对象转为数组
    o1 = {
      a: 1,
      b: 2,
      c: 3
    };
    let a2 = [];
    ({ a: a2[0], b: a2[1], c: a2[2] } = o1);
    console.info(a2);

    // 数组转对象
    let a1 = [1, 2, 3];
    o2 = {};
    [o2.a, o2.b, o2.c] = a1; // [1,2,3]
    console.info(o2, o2.a, o2.b, o2.c);

    // 将数组解构到另一个数组并修改顺序
    a1 = [1, 2, 3];
    a2 = [];
    [a2[2], a2[0], a2[1]] = a1;
    console.info(a2); // [2,3,1]

    // 不使用临时变量交换变量值
    let x = 10,
      y = 20;
    [y, x] = [x, y];
    console.info(x, y); // 20 10
  }

  // 解构赋值表达式
  {
    let o = {
        a: 1,
        b: 2,
        c: 3
      },
      a,
      b,
      c,
      p;
    // 解构表达式返回o
    console.info(({ a, b, c } = o));
    // 所以这里p指向o
    p = { a, b, c } = o;
    console.info(a, b, c, p, o, p === o);

    // 数组也是一样的情况
    {
      let o = [1, 2, 3],
        a,
        b,
        c,
        p;
      // 解构表达式返回o
      console.info(({ a, b, c } = o));
      p = [a, b, c] = o;
      console.info(a, b, c, p, o, p === o);
    }
  }

  // 只获取需要的部分
  {
    const arr = [1, 2, 3, 4, 5, 6];
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6
    };

    // 跳过不需要的值
    let [, arr2, , arr4] = arr;
    console.info(arr2, arr4);
    let { a: a1, c: c1 } = obj;
    console.info(a1, c1);

    // 合并数组
    const arr3 = [9, ...arr, 10];
    console.info(arr3);

    // 部分结构为独立变量，其余解构到一个数组
    const [arr5, ...arr6] = arr;
    console.info(arr5, arr6);

    const [x, y, ...z] = ['a'];
    console.info('解构项数量不匹配时', x, y, z);
  }

  // 解构赋值的默认值
  {
    const arr = [1, 2, 3];
    const obj = {
      a: 1,
      b: 2,
      c: 3
    };

    let [a1 = 99, b1 = 98, c1 = 97, d1 = 96] = arr;
    console.info('数组解构默认值', a1, b1, c1, d1);
    let { a: a2 = 99, b: b2 = 98, c: c2 = 97, d: d2 = 96 } = obj;
    console.info('对象解构默认值', a2, b2, c2, d2);
  }

  // 当使用对象或数组作为默认值时会让代码难以理解
  {
    let x = 200,
      y = 300,
      z = 100;
    let o1 = {
      x: { y: 42 },
      z: { y: z }
    };
    // o1对象没有属性y,所以默认值赋值给x变量，相当于 x = {y}，y = 300
    ({ y: x = { y } } = o1);
    // o1对象有z属性，而z属性的值为 {y:z} 等于 {y:100}，相当于 y = {y:z}, z = 100
    ({ z: y = { y: z } } = o1);
    // o1对象有x属性，相当于 z = {y:42}
    ({ x: z = { y: x } } = o1);
    console.info('当使用对象或数组作为默认值时会让代码难以理解', x, y, z);
  }

  // 解构嵌套
  {
    let a = [1, [2, 3, 4], 5];
    let o = { x: { y: { z: 6 } } };
    let [a1, [b1, c1, d1], e1] = a;
    let { x: { y: { z: w, q: m } } } = o;
    // 注意这里只做了解构赋值，没有自动创建一个新的数组或对象，不要弄混乱了
    console.info('数组解构嵌套', a1, b1, c1, d1, e1);
    console.info('对象解构嵌套', w, m);

    // 来个实际点的例子
    let App = {
      model: {
        name: 'model.name',
        user() {
          console.info('user', this && this.name);
        }
      }
    };

    // 相当于 user = App.model.user
    let { model: { user } } = App;
    App.model.user();
    // 注意隐式转换为直接调用函数this的问题
    user();
  }

  // 解构参数，所有前面的解构特性都可以用于参数
  {
    // 解构数组参数
    {
      // 注意前后默认值的不同，一个是参数本身的默认值，一个是解构的默认值
      function foo([x = 99, y] = [100]) {
        console.info('解构数组参数', x, y);
      }
      foo([1, 2]);
      foo([1]);
      foo([]);
      foo();
    }

    {
      // 注意前后默认值的不同，一个是参数本身的默认值，一个是解构的默认值
      function foo({ x = 99, y } = { x: 100 }) {
        console.info('解构对象参数', x, y);
      }
      foo({
        x: 1,
        y: 2
      });
      foo({ x: 1 });
      foo({ y: 2 });
      foo({});
      foo();

      // 多种参数
      function f3([x, y, ...z], ...w) {
        console.info(x, y, z, w);
      }
      f3([]); // undefined undefined [] []
      f3([1, 2, 3, 4], 5, 6); // 1 2 [3,4] [5,6]

      // 解构默认值+参数默认值
      function f6({ x = 10 } = {}, { y } = { y: 10 }) {
        console.info(x, y);
      }
      f6();
      f6(undefined, undefined);
      f6({}, undefined);
      f6({}, {});
      f6(undefined, {});
      f6({ x: 2, y: 3 }, { x: 1, y: 9 });
    }

    // 用于嵌套对象的默认值合并
    {
      // 例如最常见的配置
      var defaults = {
        options: {
          remove: true,
          enable: false,
          instance: {}
        },
        log: {
          warn: true,
          error: true
        }
      };

      // 使用Object.assign只能进行浅拷贝，结果不是我们想要的
      console.info(Object.assign({}, defaults, {
        options: {},
        log: {}
      }));

      var config = {
        options: {
          remove: false,
          instance: null
        }
      };

      {
        let {
          options: {
            remove = defaults.options.remove,
            enable = defaults.options.enable,
            instance = defaults.options.instance
          } = {},
          log: { warn = defaults.log.warn, error = defaults.log.error } = {}
        } = config;

        config = {
          options: {
            remove,
            enable,
            instance
          },
          log: {
            warn,
            error
          }
        };
        console.info('config', config);
      }
    }
  }

  // es5 getter/setter
  {
    let o = {
      $id: 10,
      get id() {
        return this.$id++;
      },
      // setter 只能有一个参数
      set id(args) {
        [this.$id] = args;
      },
      test({ id: v = 0 }) {
        console.info('test', v);
      }
    };
    console.group('es5 getter/setter');
    console.info(o.id, o.id);
    o.id = [20];
    console.info(o.id);
    console.info(o.$id);
    console.info(o.$id);
    o.test({});
    o.test({ id: 99 });
    console.groupEnd();
  }

  // 计算属性名
  {
    {
      const prefix = 'user_';
      const funcFoo = `${prefix}foo`;
      const funcBaz = `${prefix}baz`;
      const o = {
        show(val) {
          console.info('计算属性', val);
        },
        baz() {
          this.show('baz');
        },
        [funcFoo]() {
          this.show(funcFoo);
        }
      };

      o[funcBaz] = function () {
        this.show(funcBaz);
      };
      o.baz();
      o.user_foo();
      o.user_baz();

      const mySymbo = Symbol('mySymbo');
      o[mySymbo] = 'really cool thing';
      o[Symbol.toStringTag] = 'really cool thing2';
      console.info(o[mySymbo], o[Symbol.toStringTag]);
    }
  }

  // 对象super关键字
  /* {
    const o1 = {
      foo() {
        console.info('o1:foo');
      }
    };

    const o2 = {
      foo() {
        // super只允许用于简明函数声明中
        super.foo();
        console.info('o2:foo');
      }
    };

    Object.setPrototypeOf(o2, o1);
    o2.foo();
  } */

  // es6字符串
  {
    const text = `es6多行字符串
      第一行
      第二行
      第三行`.replace(/\n/g, '').replace(/\s+/g, ' ');
    console.info(text);

    // 嵌套
    function upper(s) {
      return s.toUpperCase();
    }
    const who = 'reader';
    // 嵌套使用时看起来会比较混乱
    const text2 = `A very ${upper('warm')} welcome
  to all of you ${upper(`${who}s`)}!`.replace(/\n/g, '');
    console.info(text2);

    // 表达式作用域
    function foo(str) {
      var name = 'foo';
      console.info(str);
    }
    function bar() {
      var name = 'bar';
      // 这里的字符串表达式就像立即函数一样会马上执行
      foo(`Hello from ${name}!`);
    }
    var name = 'global';
    bar(); // "Hello from bar!"

    // 标签模板
    function tag(strings, ...values) {
      console.info(strings, values);
      return [strings, values];
    }

    // 标签模板2
    function tag2(strings, v1, v2, v3) {
      console.info(strings, v1, v2, v3);
    }

    /**
     * 还原字符串
     * @param {Array} strings
     * @param {Array} args
     */
    function tagReset(strings, ...args) {
      console.info('字符串还原', strings, args);
      // let s = '';
      // let i;
      // 第一个参数长度必定大于第二个
      // for (i = 0; i < args.length; i++) {
      //   s += strings[i] + args[i];
      // }
      return strings.reduce((s, v, i) => {
        console.info(`reduce i:${i}`);
        return s + (i > 0 ? args[i - 1] : '') + v;
      }, '');
      // return s + strings[i];
    }

    // 过滤变量内容
    function safe(strings, ...args) {
      let s = '';
      let i;
      // 第一个参数长度必定大于第二个
      for (i = 0; i < args.length; i++) {
        let arg = args[i];
        // 替换特殊字符
        s += arg
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        s += strings[i];
      }
      return s;
    }

    const desc = 'awesome';
    tag`Everything is ${desc}!`;

    const a = 5;
    const b = 10;
    tag`Hello ${a + b} world ${a * b}`;
    tag2`Hello ${a + b} world ${a * b}`;
    let res = tagReset`Hello ${a + b} world ${a * b}!`;
    console.info(res);
    res = tagReset`Hello world!`;
    console.info(res);

    // 过滤特殊字符,保证安全
    let userInput = '<script>alert("abc")</script>';
    res = safe`<p>${userInput} has sent you a message.</p>`;
    console.info(res);

    // 动态返回处理函数
    function dynamicTag(type = 1) {
      if (type === 1) {
        return (strings, ...values) => {
          console.info('根据条件返回不同的解析函数1', this, strings, values);
        };
      } else if (type === 2) {
        return (strings, ...values) => {
          console.info('根据条件返回不同的解析函数2', strings, values);
        };
      }
    }
    var desc = 'awesome';
    dynamicTag()`Everything is ${desc}!`;
    dynamicTag(2)`Everything is ${desc}!`;

    // raw strings
    {
      function showraw(strings, ...values) {
        console.info(strings, strings.raw);
      }

      showraw`Hello\nWorld`;
      console.info(`Hello\nWorld`);
      // 将字换行符号转换为原始字符串
      console.info('原始字符串', String.raw`Hello\nWorld`);
    }
  }

  // 箭头函数
  {
    // 剪头函数都是函数表达式，不存在剪头函数定义
    function Scope() {
      this.helper = function () {
        console.info('scope helper');
      };
      const controller = {
        makeRequest: () => {
          console.info('makeRequest');
          console.dir(this);
          // 剪头函数中的this来自当前作用域
          this.helper();
        },
        helper: () => {
          console.info('helper');
        }
      };

      controller.makeRequest();
    }

    const scope = new Scope();
  }

  // for..of语句
  {
    {
      const a = ['a', 'b', 'c', 'd', 'e'];
      let res = [];
      for (let idx in a) {
        res.push(idx);
      }
      console.info(res.join(','));

      res = [];
      for (let idx of a) {
        res.push(idx);
      }
      console.info(res.join(','));
    }

    {
      const a = ['a', 'b', 'c', 'd', 'e'],
        k = Object.keys(a);
      let res = [];
      for (let val, i = 0; i < k.length; i++) {
        val = a[k[i]];
        res.push(val);
      }
      console.info(res.join(','));
    }

    {
      const a = ['a', 'b', 'c', 'd', 'e'],
        k = Object.keys(a);
      let res = [];
      for (let val, i = 0; i < k.length; i++) {
        val = a[k[i]];
        res.push(val);
      }
      console.info(res.join(','));

      let b = ['a', 'b', 'c', 'd', 'e'];
      res = [];
      for (let ret, it = a[Symbol.iterator](); (ret = it.next()) && !ret.done;) {
        res.push(ret.value);
      }
      console.info(res.join(','));
    }

    // 字符串迭代
    {
      const s = '发的d啥发的b啥范德萨c范德萨发生的';
      const res = [];
      for (let c of s) {
        res.push(c);
      }
      console.info(res.join(','));
    }

    // 生成器迭代
    {
      function *gen() {
        let a, b;
        try {
          a = yield;
          b = yield;
        } finally {
          yield 'finally';
        }
        return a + b;
      }
      const it = gen();
      let i = 1,
        res;
      for (res = it.next(); res && !res.done && (res = it.next(i)); i++) {
        console.info('生成器迭代', res);
        if (res.value === 'finally') {
          res = it.return('提前退出');
        }
      }
      console.info('生成器迭代', res);
    }

    // 利用迭代赋值
    {
      let o = {};
      for (o.a of [1, 2, 3]) {
        console.info('利用迭代赋值', o.a);
      }
      console.info('利用迭代赋值', o);

      o = {};
      for ({ x: o.a, y: o.b } of [{ x: 1 }, { x: 2 }, { y: 99 }, { x: 3 }]) {
        console.info('利用迭代赋值', o.a);
      }
      console.info('利用迭代赋值', o);
    }
  }

  // 正则表达式
  {
    // unicode flag
    // ES6 对正则表达式添加了u修饰符，含义为“Unicode 模式”，用来正确处理大于\uFFFF的 Unicode 字符。也就是说，会正确处理四个字节的 UTF-16 编码。
    {
      // 例1
      console.info(/𝄞/.test('𝄞-clef')); // true
      console.info(/^.-clef/.test('𝄞-clef')); // false
      console.info(/^.-clef/u.test('𝄞-clef')); // true

      // 例2
      // 下面的代码中，\uD83D\uDC2A是一个四个字节的 UTF-16 编码，代表一个字符。但是，ES5 不支持四个字节的 UTF-16 编码
      // 会将其识别为两个字符，导致第二行代码结果为true。加了u修饰符以后，ES6 就会识别其为一个字符，所以第一行代码结果为false。
      console.info(/^\uD83D/u.test('\uD83D\uDC2A')); // false
      console.info(/^\uD83D/.test('\uD83D\uDC2A')); // true

      // 例3 点字符
      // 点（.）字符在正则表达式中，含义是除了换行符以外的任意单个字符。对于码点大于0xFFFF的 Unicode 字符，点字符不能识别，必须加上u修饰符。
      // 如果不添加u修饰符，正则表达式就会认为字符串为两个字符，从而匹配失败。
      var s = '𠮷';
      console.info(/^.$/.test(s)); // false
      console.info(/^.$/u.test(s)); // true

      // 例4 Unicode 字符表示法
      // ES6 新增了使用大括号表示 Unicode 字符，这种表示法在正则表达式中必须加上u修饰符，才能识别当中的大括号，否则会被解读为量词。
      // 如果不加u修饰符，正则表达式无法识别\u{61}这种表示法，只会认为这匹配 61 个连续的u。
      console.info(/\u{61}/.test('a')); // false
      console.info(/\u{61}/u.test('a')); // true
      console.info(/\u{20BB7}/u.test('𠮷')); // true

      // 例5 量词
      // 使用u修饰符后，所有量词都会正确识别码点大于0xFFFF的 Unicode 字符。
      console.info(/a{2}/.test('aa')); // true
      console.info(/a{2}/u.test('aa')); // true
      console.info(/𠮷{2}/.test('𠮷𠮷')); // false
      console.info(/𠮷{2}/u.test('𠮷𠮷')); // true

      // 例6 预定义模式
      // u修饰符也影响到预定义模式，能否正确识别码点大于0xFFFF的 Unicode 字符。
      // 下面代码的\S是预定义模式，匹配所有不是空格的字符。只有加了u修饰符，它才能正确匹配码点大于0xFFFF的 Unicode 字符。
      console.info(/^\S$/.test('𠮷')); // false
      console.info(/^\S$/u.test('𠮷')); // true

      // 利用这一点，可以写出一个正确返回字符串长度的函数。
      function codePointLength(text) {
        var result = text.match(/[\s\S]/gu);
        return result ? result.length : 0;
      }

      let s = '𠮷𠮷';
      console.info(s.length, codePointLength(s));
    }

    // y 修饰符 sticky”粘连”修饰符
    // y修饰符的作用与g修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。
    // 不同之处在于，g修饰符只要剩余位置中存在匹配就可，而y修饰符确保匹配必须从剩余的第一个位置开始，这也就是“粘连”的涵义。
    {
      try {
        let s = 'aaa_aa_a';
        let r1 = /a+/g;
        let r2 = /a+/y;

        console.info(r1.exec(s), r2.exec(s), r1.exec(s), r2.exec(s), r1.sticky, r2.sticky);
      } catch (error) {
        console.error('ie edge 以下版本不支持y正则修饰符');
      }
    }
  }

  // 数字表达式
  {
    console.info(Number('42'), Number('052'), Number('0x2a'));
    // 直接写数值时ie支持
    console.info(42, 0o52, 0x2a, 0b101010);
    // 使用字符串时ie edge以下不支持8进制和二进制表示
    console.info(Number('42'), Number('0o52'), Number('0x2a'), Number('0b101010'));
    // 数字位数转换
    let a = 42;
    let b = 0x10;
    console.info(a.toString(), a.toString(10), a.toString(8), a.toString(16), a.toString(2));
    console.info(b.toString(), b.toString(8), b.toString(2));

    // 双字节字符转16进制
    let s = '𠮷a';
    // 要正确处理双字节字符串必须使用codePointAt方法
    try {
      let code = s.codePointAt(0).toString(16);
      let code2 = s.charCodeAt(1).toString(16);
      let code3 = s.charCodeAt(2).toString(16);
      let code4 = s.codePointAt(2).toString(16);
      console.info(code, code2, code3, code4);
    } catch (error) {
      console.error('ie edge 以下不支持codePointAt方法');
    }
    // 双字节字符串长度为2
    console.info(
      s.length,
      s.charCodeAt(0).toString(16),
      s.charCodeAt(1).toString(16),
      '\u{61}',
      '\u{20bb7}' // 超出\uFFFF必须使用大括号标识
    );
    // 正确判断双字节字符串长度
    console.info([...s].length, Array.from(s).length);
    console.info([...s], Array.from(s));
    // 正确的识别32位的UTF-16字符串
    for (let ch of s) {
      console.info(ch);
    }
  }

  // Symbol
  {
    let symbol = Symbol('symbol');
    // 在edge浏览器中如果直接输入Symbol对象会报错，所以要用String先做转换
    console.info(String(symbol));

    {
      // 没有参数的情况
      let s1 = Symbol('s1');
      let s2 = Symbol('s1');
      console.info(`s1 === s2: ${s1 === s2}`);

      // 有参数的情况
      let s3 = Symbol('foo');
      let s4 = Symbol('foo');
      console.info(`s3 === s4: ${s3 === s4}`);
    }
  }

  // 全局Symbol
  {
    var globalSymbol = Symbol.for('s1');
    let gs2 = Symbol.for('s1');
    console.info(
      '全局Symbol',
      globalSymbol === gs2, globalSymbol === Symbol('s1'),
      Symbol.keyFor(globalSymbol), Symbol.keyFor(gs2)
    );

    // 在不同的iframe和service worker中共享
    // let iframe = document.createElement('iframe');
    // iframe.setAttribute('src', `http://${location.host}/websocket.html`);
    // document.body.appendChild(iframe);
    // iframe.onload = () => {
    //   console.info('全局Symbol在不同的iframe和service worker中共享', iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo'));
    // };
  }

  // Symbol 属性名
  {
    let s1 = Symbol('Symbol属性写法1'), s2 = Symbol('Symbol属性写法2'), s3 = Symbol('Symbol属性写法3');
    let a = { att: 1 };
    a[s1] = 'Symbol属性写法1';

    let b = { [s2]: 'Symbol属性写法2' };

    let c = {};
    Object.defineProperty(c, s3, { value: 'Symbol属性写法3' });
    console.info(a[s1], b[s2], c[s3]);

    // Symbol 无法被遍历
    for (let att in a) {
      console.info('Symbol 无法被遍历', att);
    }
    console.info(Object.keys(a), Object.getOwnPropertyNames(a), Object.getOwnPropertySymbols(a));
    // 获取所有属性
    console.info('获取对象包括Symbol在内的所有属性', Reflect.ownKeys(a));
  }

  // Symbol 常量
  {
    const logLevels = {
      DEBUG: Symbol('DEBUG'),
      INFO: Symbol('INFO'),
      WARN: Symbol('WARN')
    };

    switch (logLevels.DEBUG) {
      case logLevels.DEBUG:
        console.info('logLevel', 'DEBUG');
        break;
      case logLevels.INFO:
        console.info('logLevel', 'INFO');
        break;
      case logLevels.WARN:
        console.info('logLevel', 'WARN');
        break;

      default:
        break;
    }
  }

  return { globalSymbol };
};
