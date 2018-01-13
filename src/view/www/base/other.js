
export default () => {
  // 表达式
  {
    function func1() {
      return 'func1';
    }
    function func2() {
      return 'func2';
    }

    console.info('表达式', ('a', 'b'), (func1(), func2()));
  }

  // 标签
  {
    function test(printTwo) {
      printing: {
        console.info('One');
        if (!printTwo) break printing;
        console.info('Two');
        return '没有提前跳出标签';
      }
      console.info('Three');
      return '提前跳出标签';
    }
    console.info('标签', test(true), test(false));
  }

  // setTimeout Promise 执行顺序
  {
    {
      // Promise > setTimeout
      console.info('script start');
      // 注意在非原生支持Promise的浏览器中是用setTimeout来模拟Promise，所以执行顺序会不确定
      setTimeout(function () {
        console.info('setTimeout');
      }, 0);

      Promise.resolve().then(function () {
        console.info('promise1');
      }).then(function () {
        console.info('promise2');
      });

      console.info('script end');
    }
  }
};
