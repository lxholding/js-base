export default () => {
  console.group('原生函数');
  (() => {
    const natives = [
      String,
      Math,
      Number,
      Boolean,
      Array,
      Object,
      Function,
      RegExp,
      Date,
      Error,
      Symbol
    ];
    for (const native of natives) {
      console.info(native);
    }

    const ss = new String('字符串');
    console.info(ss);
    console.info(`ss instanceof String:${ss instanceof String} '字符串' instanceof String:${'字符串' instanceof
        String}`);
  })();
  console.groupEnd();

  console.group('内部属性[[Class]]');
  (() => {
    console.info([1, 2, 3].toString(), Object.prototype.toString.call([1, 2, 3]));
    console.info(/regex-literal/i.toString(), Object.prototype.toString.call(/regex-literal/i));
    console.info(Object.prototype.toString.call(null));
    console.info(Object.prototype.toString.call(undefined));
    console.info(Object.prototype.toString.call('abc'));
    console.info(Object.prototype.toString.call(42));
    console.info(Object.prototype.toString.call(true));

    const arrA = new Array(3);
    const arrB = [undefined, undefined, undefined];
    const arrC = [];
    arrC.length = 3;
    console.info(arrA, arrB, arrC);
    console.info(arrA.join('_'), arrB.join('_'));
    console.info(arrA.map((v, i) => i), arrB.map((v, i) => i), arrC.map((v, i) => i));
    const arrD = Array.apply(null, { length: 3 });
    console.info(arrD);

    console.info(Date());

    function throwError() {
      throw new Error('抛出异常错误');
    }
    try {
      throwError();
    } catch (error) {
      console.error(error.toString(), error);
    }
  })();
  console.groupEnd();

  console.group('符号');
  (() => {
    const mySym = Symbol('自定义符号');
    console.info(mySym);
    const mySym2 = Symbol('自定义符号');
    console.info(mySym2);
    console.info(mySym == mySym2);
  })();
  console.groupEnd();
};
