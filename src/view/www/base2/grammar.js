/* eslint no-fallthrough:off */
export default () => {
  (() => {
    function foo() {
      a += 1;
    }
    var a = 1;
    foo();
    console.info(a);

    var b = 42, c;
    c = (b++, b);
    console.info(b, c);
  })();

  (() => {
    var matches;
    /**
     * @param {String} str
     */
    function vowels(str) {
      if (str && (matches = str.match(/[aeiou]/g))) {
        return matches;
      }
    }
    var ms = vowels('hhhhhh');
    if (ms == null) {
      console.info(ms, matches);
    }
  })();

  // 标签语句
  (() => {
    // 标签为foo的循环
    foo: for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        // 如果j和i相等，继续外层循环
        if (j == i) {
          // 跳转到foo的下一个循环
          continue foo;
        }
        // 跳过奇数结果
        if ((j * i) % 2 == 1) {
          // 继续内层循环(没有标签的)
          continue;
        }
        console.info(i, j);
      }
    }

    console.info('-----------');

    // 标签为foo的循环
    foo: for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if ((i * j) >= 3) {
          console.info('stopping!', i, j);
          break foo;
        }
        console.info(i, j);
      }
    }
    console.info('--------------');

    // 标签为bar的代码块
    function foo2() {
      bar: {
        console.info('Hello');

        break bar;
        console.info('never runs');
      }
    }
    console.info('World');
    foo2();
  })();

  // json
  (() => {
    // 错误，被当 作一个带有非法标签的语句块来执行
    // { 'a': 1 };
    const obj = {
      'a': 1
    };
    function foo(json) {
      console.info(json);
    }
    foo(obj);
    foo({
      'b': 2
    });
  })();

  (() => {
    const a = [] + {};
    const b = {} + [];
    console.info(a, b);

    const c = false;
    if (c) {
      console.info('if');
    } else

    if (!c) {
      console.info('else if');
    }
  })();

  console.group('ES6默认参数');
  (() => {
    function foo(a = 42, b = a + 1) {
      console.info(a, b);
    }
    foo();
    foo(undefined);
    foo(5);
    foo(void 0, 7);
    foo(null);
  })();
  console.groupEnd();

  console.group('try...finally');
  (() => {
    console.group('foo');
    function foo() {
      try {
        console.info('try');
        return 42;
      } catch (error) {
        console.error(error);
      } finally {
        console.info('finally 总是会执行');
      }
      console.info('never runs');
    }
    console.info(foo());
    console.groupEnd();

    console.group('foo2');
    function foo2() {
      try {
        console.info('try');
        return 42;
      } catch (error) {
        console.error(error);
      } finally {
        console.info('finally');
        return 'finally 中的return会覆盖try中的return';
      }
      console.info('never runs');
    }
    console.info(foo2());
    console.groupEnd();

    console.group('foo3');
    function foo3() {
      try {
        console.info('try');
        throw Error(42);
      } catch (error) {
        console.error(error);
        return 43;
      } finally {
        console.info('finally');
        return 'finally 中的return会覆盖catch中的return';
      }
      console.info('never runs');
    }
    try {
      console.info(foo3());
    } catch (error) {
      console.error('foo3', error);
    }
    console.groupEnd();

    console.group('foo4');
    function foo4() {
      try {
        console.info('try');
        throw Error(42);
      } catch (error) {
        throw Error(43);
      } finally {
        console.info('finally');
        throw Error('finally 中抛出的异常会覆盖try和catch中抛出的异常');
      }
      console.info('never runs');
    }
    try {
      console.info(foo4());
    } catch (error) {
      console.error('foo4', error);
    }
    console.groupEnd();

    console.group('continue 在每次循环之后，会在 i++ 执行之前执行 console.log(i)，所以结果是 0..9 而非');
    for (let i = 0; i < 10; i++) {
      try {
        continue;
      } finally {
        console.info(i);
      }
    }
    console.groupEnd();

    var a = '42';
    switch (true) {
      case a == 10:
        console.info("10 or '10'");
        break;
      case a == 42:
        console.info("42 or '42'");
        break;
      default:
    }

    var b = 10;
    switch (b) {
      case 1:
      case 2:
      // 永远执行不到这里
      default:
        console.info('default');
      case 3:
        console.info('3');
        break;
      case 4:
        console.info('4');
    }

    function addAll(...args) {
      var sum = 0;
      for (var i = 0; i < args.length; i++) {
        sum += args[i];
      }
      return sum;
    }
    var nums = [];
    for (let i = 1; i < 100000; i++) {
      nums.push(i);
      addAll(2, 4, 6);
    }
    // 应该是: 499950000
    try {
      console.info(addAll.apply(null, nums));
    } catch (error) {
      console.error('safari限制了参数数量，会抛出异常错误', error);
    }
  })();
  console.groupEnd();
};
