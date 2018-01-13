export default () => {
  (() => {
    console.group('基本类型');
    console.info(typeof undefined);
    console.info(typeof true);
    console.info(typeof 42);
    console.info(typeof '42');
    console.info(typeof { val: 42 });
    console.info(typeof Symbol(undefined));
    console.info(`null的类型判断有问题 typeof null:${typeof null}`);

    function foo(a, b) {

    }
    console.info(`函数实际上只是object的子类型 typeof foo:${typeof foo} 函数名:${foo.name} 参数数:${foo.length}`);
    console.groupEnd();

    console.info(`数组不是一个基本类型，是object的子类型 typeof [1,2,3]:${typeof [1, 2, 3]}`);
  })();

  // 值和类型:js中变量没有类型，只有值才有，变量可以随时持有任何类型的值
  (() => {
    let a = 42;
    console.info(`a:${typeof a}`);
    a = '42';
    console.info(`a:${typeof a}`);
  })();

  // undefined和undeclared
  (() => {
    let a;
    console.info(`undefined a:${a}`);
    try {
      console.info(`undeclared b:${b}`);
    } catch (error) {
      console.error('is not define 不等于undefined', error);
    }
    console.info(`typeof未声明变量不会抛出异常 b:${typeof b}`);
  })();
};
