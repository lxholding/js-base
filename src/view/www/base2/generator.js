export default (ajax) => {
  // generator
  (() => {
    let x = 1;
    function *foo() {
      x++;
      yield;
      console.info(`x:${x}`);
    }

    function bar() {
      x++;
    }

    const it = foo();
    let itRes = it.next();
    console.info(`x:${x}`, itRes, itRes.value, itRes.done);
    bar();
    console.info(`x:${x}`);
    itRes = it.next();
    console.info(`x:${x}`, itRes, itRes.value, itRes.done);

    function *foo2(x, y) {
      return x * y;
    }
    const it2 = foo2(6, 7);
    const res = it2.next();
    console.info(res, res.value, res.done);

    function *foo3(x) {
      const y = x * (yield);
      return y;
    }
    const it3 = foo3(6);
    it3.next();
    // next传参
    const it3Res = it3.next(8);
    console.info(it3Res);

    function *foo4(x) {
      let y;
      if (x) {
        y = x * (yield 1);
      } else {
        y = yield 2;
      }
      return y;
    }

    let it4 = foo4(1);
    let it4Res = it4.next();
    console.info(it4Res);
    it4Res = it4.next(4);
    console.info(it4Res);

    it4 = foo4();
    it4Res = it4.next();
    console.info(it4Res);
    it4Res = it4.next(5);
    console.info(it4Res);
  })();

  // 迭代器
  (() => {
    const something = (() => {
      let nextVal;
      return {
        [Symbol.iterator]() {
          return this;
        },
        next() {
          if (nextVal == null) {
            nextVal = 1;
          } else {
            nextVal = 3 * nextVal + 6;
          }

          return { done: nextVal > 999, value: nextVal };
        }
      };
    })();

    for (const v of something) {
      console.info(`iterator:${v}`);
    }

    function *something2() {
      let nextVal;
      try {
        while (true) {
          if (nextVal == null) {
            nextVal = 1;
          } else {
            nextVal = 3 * nextVal + 6;
          }
          yield nextVal;
        }
      } finally {
        console.info('清理！');
      }
    }

    for (const v of something2()) {
      console.info(`iterator:${v}`);
      if (v > 999) {
        break;
      }
    }

    const it2 = something2();
    for (const v of it2) {
      console.info(`iterator:${v}`);
      if (v > 999) {
        console.info(it2.return('end').value);
        // 不需要break
      }
    }
  })();

  // 异步迭代生成器
  (() => {
    function foo(url, it) {
      return ajax('tag foo', url)
        .then((data) => {
          it.next(data);
        })
        .catch((error) => {
          it.throw(error);
        });
    }
    function *main(tag, url) {
      try {
        const it = yield;
        const data = yield foo(url, it);
        console.info(tag, 'main data', data);
      } catch (error) {
        console.error(tag, 'main error', error);
      }
    }

    let it = main('tag1', '/api/1');
    it.next();
    let res = it.next(it);
    console.info('main res', res);

    it = main('tag2', '/api');
    it.next();
    res = it.next(it);
    console.info('main res', res);

    function *main2(tag, url) {
      try {
        var data = yield ajax('tag main2', url);
        console.info(tag, 'main2 data', data);
      } catch (error) {
        console.error(tag, 'main2 error', error);
      }
    }

    const it2 = main2('tag3', '/api/1');
    const p2 = it2.next().value;
    p2
      .then((data) => {
        it2.next(data);
      })
      .catch((error) => {
        it2.throw(error);
      });

    const it3 = main2('tag4', '/api');
    const p3 = it3.next().value;
    p3
      .then((data) => {
        it3.next(data);
      })
      .catch((error) => {
        it3.throw(error);
      });

    // Generator Runner
    function run(gen, tag, ...args) {
      // 在当前上下文中初始化生成器
      const it = gen.apply(this, args);
      // 返回一个promise用于生成器完成
      return Promise.resolve().then(function handleNext(value) {
        console.info(tag, 'run handleNext value', value);
        // 对下一个yield出的值运行
        var nextRes = it.next(value);

        return (function handleResult(nextRes) {
          console.info(tag, 'run handleResult', nextRes);
          // 生成器运行完毕？
          if (nextRes.done) {
            return nextRes.value;
          }
          // 继续运行，如果是Promise则直接返回并接收决议回调
          return Promise.resolve(nextRes.value).then(
            // 成功就恢复异步循环，把决议的值发回生成器
            handleNext,
            // 如果value是被拒绝的Promise，
            // 就把错误传回生成器进行出错处理
            function handleErr(error) {
              // 通过生成器抛出错误，用来被try..catch捕获
              const res = it.throw(error);
              console.info(tag, 'run handleErr', res);
              res.value = '错误返回值';
              // 会将错误结果传回
              const p = Promise.resolve(res).then(handleResult);
              console.info(tag, 'run handleErr p', p);
              p.then((val) => {
                console.info(tag, 'run handleErr p fulfill', val);
              });
              return p;
            }
          );
        })(nextRes);
      });
    }
    run(main2, 'tag5', '/api/1');
    run(main2, 'tag6', '/api');

    async function main3(url) {
      try {
        const data = await ajax('tag main3', url);
        console.info('main3', data);
        return data;
      } catch (error) {
        console.error('main3', error);
        throw error;
      }
    }

    // async函数返回的是一个Promise
    let main3Promise = main3('/api/1');
    console.info('main3Promise', main3Promise);
    // 获取async函数返回值
    main3Promise.then((val) => {
      console.info('main3 promise fulfill', val);
    });

    main3Promise = main3('/api');
    console.info('main3Promise', main3Promise);
    // 获取async函数抛出的异常
    main3Promise.catch((error) => {
      console.error('main3 promise reject', error);
    });

    // 生成器中的Promise并发问题
    (() => {
      function *foo5() {
        const timeStart = Date.now();
        // 阻塞后面的请求
        var r1 = yield ajax('tag foo5 1', '/api/sleep/5000');
        // 阻塞后面的请求
        var r2 = yield ajax('tag foo5 2', '/api/3');
        console.info('foo5');
        var r3 = yield ajax('tag foo5 3', `/api/1?p=${r1.data.data},${r2.data.data}`);
        console.info('foo5', `${Date.now() - timeStart}ms`, r3);
      }
      run(foo5);

      function *foo6() {
        const timeStart = Date.now();
        // 开始并发执行
        var p1 = ajax('tag foo6 1', '/api/sleep/10000');
        var p2 = ajax('tag foo6 2', '/api/3');
        // 等待结果
        const r1 = yield p1;
        const r2 = yield p2;
        console.info('foo6');
        var r3 = yield ajax('tag foo6 3', `/api/1?p=${r1.data.data},${r2.data.data}`);
        console.info('foo6', `${Date.now() - timeStart}ms`, r3);
      }
      run(foo6);

      function *foo7() {
        const timeStart = Date.now();
        // 开始并发执行并等待结果
        const [r1, r2] = yield Promise.all([ajax('tag foo7 1', '/api/sleep/15000'), ajax('tag foo7 2', '/api/3')]);
        var r3 = yield ajax('tag foo7 3', `/api/1?p=${r1.data.data},${r2.data.data}`);
        console.info('foo7', `${Date.now() - timeStart}ms`, r3);
      }
      run(foo7);

      function *foo8() {
        // 将异步请求细节封装在一个内部函数中
        function bar() {
          // 开始并发执行
          return Promise.all([ajax('tag foo8 1', '/api/sleep/15000'), ajax('tag foo8 2', '/api/3')]);
        }
        const timeStart = Date.now();
        const [r1, r2] = yield bar();
        var r3 = yield ajax('tag foo8 3', `/api/1?p=${r1.data.data},${r2.data.data}`);
        console.info('foo8', `${Date.now() - timeStart}ms`, r3);
      }
      run(foo8);
    })();

    // yield委托
    (() => {
      // 简单实例
      function *foo() {
        console.info('*bar *foo() 开始');
        yield 3;
        yield 4;
        console.info('*bar *foo() finished');
      }

      function *bar() {
        var tmp = yield 1;
        console.info('*bar tmp', tmp);
        yield 2;
        yield *foo();
        yield 5;
        return 'done';
      }

      var it = bar();
      console.info('*bar *foo', it.next());
      console.info('*bar *foo', it.next('tmp赋值'));
      console.info('*bar *foo', it.next());
      console.info('*bar *foo', it.next());
      console.info('*bar *foo', it.next());
      console.info('*bar *foo', it.next());

      // ajax实例
      function *bar2() {
        function *foo2() {
          var r2 = yield ajax('yield委托 bar2 r2', '/api/sleep/2000?tag=r2');
          var r3 = yield ajax('yield委托 bar2 r3', '/api/sleep/1000?tag=r3');
          var r4 = yield ajax('yield委托 bar2 r4', '/api/error?msg=yield委托+bar2+r4');

          return [r2, r3, r4];
        }

        var r1 = yield ajax('yield委托 bar2 r1', '/api/sleep/3000?tag=r1');
        try {
          var [r2, r3, r4] = yield *foo2();
          console.info('yield委托 bar2', r1, r2, r3, r4);
        } catch (error) {
          console.dir(error);
          console.error('yield委托 bar2', error.response.data);
        }
      }
      run(bar2);
    })();

    // 消息委托
    (() => {
      // 例1
      console.group('消息委托 例1');
      function *foo() {
        console.info('inside *foo():', yield 'B');
        console.info('inside *foo():', yield 'C');
        return 'D';
      }
      function *bar() {
        console.info('inside *bar():', yield 'A');
        // yield委托!
        console.info('inside *bar():', yield *foo());
        console.info('inside *bar():', yield 'E');
        return 'F';
      }
      var it = bar();
      console.info('outside:', it.next().value);
      // outside: A
      console.info('outside:', it.next(1).value);
      // inside *bar(): 1
      // outside: B
      console.info('outside:', it.next(2).value);
      // inside *foo(): 2
      // outside: C
      console.info('outside:', it.next(3).value);
      // inside *foo(): 3
      // inside *bar(): D
      // outside: E
      console.info('outside:', it.next(4).value);
      // inside *bar(): 4
      // outside: F
      console.groupEnd();

      console.group('消息委托 例2');
      function *bar2() {
        console.info('inside2 *bar():', yield 'A');
        // yield委托给非生成器!
        console.info('inside2 *bar():', yield *['B', 'C', 'D']);
        console.info('inside2 *bar():', yield 'E');
        return 'F';
      }
      var it2 = bar2();
      console.info('outside2:', it2.next().value);
      // outside2: A
      console.info('outside2:', it2.next(1).value);
      // inside2 *bar(): 1
      // outside2: B
      console.info('outside2:', it2.next(2).value);
      // outside2: C
      console.info('outside2:', it2.next(3).value);
      // outside2: D
      console.info('outside2:', it2.next(4).value);
      // inside2 *bar(): undefined
      // outside2: E
      console.info('outside2:', it2.next(5).value);
      // inside2 *bar(): 5
      // outside2: F
      console.groupEnd();

      console.group('异常委托');
      function *foo3() {
        try {
          yield 'B';
        } catch (err) {
          console.info('error caught inside *foo3():', err);
        }
        yield 'C';
        throw 'D';
      }

      function *bar3() {
        yield 'A';
        try {
          yield *foo3();
        } catch (err) {
          console.info('error caught inside *bar3():', err);
        }
        yield 'E';
        yield *baz();
        // 注:不会到达这里!
        yield 'G';
      }
      function *baz() {
        throw 'F';
      }
      var it3 = bar3();
      console.info('outside:', it3.next().value);
      // outside: A
      console.info('outside:', it3.next(1).value);
      // outside: B
      console.info('outside:', it3.throw(2).value);
      // error caught inside *foo3(): 2
      // outside: C
      console.info('outside:', it3.next(3).value);
      // error caught inside *bar3(): D
      // outside: E
      try {
        console.info('outside:', it3.next(4).value);
      } catch (err) {
        console.info('error caught outside:', err);
      }
      // error caught outside: F
      console.groupEnd();
    })();

    // 递归委托
    (() => {
      function *foo(val) {
        if (val > 1) {
          val = yield *foo(val - 1);
          console.info('递归委托 val', val);
        }

        const res = yield ajax('递归委托', `/api/return/${val}`);
        console.info('递归委托', 'data', res.data);
        return res.data + 1;
      }
      function *bar() {
        const r1 = yield *foo(3);
        console.info('递归委托', '完成', r1);
      }
      run(bar, '递归委托');
    })();

    // 生成器并发 例1
    (() => {
      const res = [];
      function *reqData(url) {
        res.push(yield ajax('生成器并发', url));
      }
      const it1 = reqData('/api/return/1');
      const it2 = reqData('/api/return/2');

      const p1 = it1.next().value;
      const p2 = it2.next().value;
      console.info('生成器并发 Promise', p1, p2);

      p1
        .then((data) => {
          console.info('生成器并发 p1 数据', data);
          it1.next(data);
          return p2;
        })
        .then((data) => {
          console.info('生成器并发 p2 数据', data);
          it2.next(data);
          console.info('生成器并发 结果', res);
        })
        .catch((error) => {
          console.error('生成器并发', error);
        });
    })();

    // 生成器并发 例2
    (() => {
      const res = [];
      function *reqData(url) {
        const data = yield ajax('生成器并发2', url);
        // 控制转移
        yield;
        console.info('生成器并发2 push', data);
        res.push(data);
      }
      const it1 = reqData('/api/return/1');
      const it2 = reqData('/api/return/2');

      const p1 = it1.next().value;
      const p2 = it2.next().value;
      console.info('生成器并发2 Promise', p1, p2);

      p1.then((data) => {
        console.info('生成器并发2 p1 数据', data);
        it1.next(data);
      });

      p2.then((data) => {
        console.info('生成器并发2 p2 数据', data);
        it2.next(data);
      });

      Promise.all([p1, p2]).then(() => {
        // it1先通过控制转移点加入数组
        it1.next();
        it2.next();
        console.info('生成器并发2 结果', res);
      });
    })();

    // 生成器并发 例3
    (() => {
      const res = [];
      async function reqData(url, tag) {
        const data = await ajax('生成器并发3', url);
        console.info('生成器并发3 push', tag, data);
        return data;
      }

      const p1 = reqData('/api/sleep/10000', 'p1');
      const p2 = reqData('/api/sleep/5000', 'p2');
      console.info('生成器并发3 Promise', p1, p2);

      const p3 = (async function (p1, p2) {
        let data = await p1;
        console.info('生成器并发3 p1 push');
        res.push(data);
        data = await p2;
        console.info('生成器并发3 p2 push');
        res.push(data);
      })(p1, p2);

      p3.then(() => {
        console.info('生成器并发3 结果', res);
      });
    })();

    // 生成器并发 例4
    (() => {
      const res = [];

      async function reqData2(url, tag) {
        const data = await ajax('生成器并发4 reqData2', url);
        console.info('生成器并发4 reqData2 push', tag, data);
      }

      async function reqData(url, tag) {
        // 异步执行
        reqData2('/api/sleep/15000', tag);
        const data = await ajax('生成器并发4', url);
        console.info('生成器并发4 push', tag, data);
        return data;
      }

      const p1 = reqData('/api/sleep/10000', 'p1');
      const p2 = reqData('/api/sleep/5000', 'p2');
      console.info('生成器并发4 Promise', p1, p2);

      const p3 = (async function (p1, p2) {
        let data = await p1;
        console.info('生成器并发4 p1 push');
        res.push(data);
        data = await p2;
        console.info('生成器并发4 p2 push');
        res.push(data);
      })(p1, p2);

      p3.then(() => {
        console.info('生成器并发4 结果', res);
      });
    })();
  })();

  (() => {
    function *fibo() {
      let a = 0;
      let b = 1;

      yield a;
      yield b;

      while (true) {
        const next = a + b;
        a = b;
        b = next;
        yield next;
      }
    }

    const generator = fibo();

    for (var i = 0; i < 10; i++) console.info('斐波那契数列', generator.next().value);
  })();
};
