export default () => {
  // 类数组
  (() => {
    console.group('类数组');
    console.info(Array.from('foo'));
    console.info([1, 2] instanceof Array);
    console.groupEnd();
  })();

  // 字符串
  (() => {
    const a = '中fo文o字☆符øπ∂';
    const b = ['f', 'o', 'o'];

    console.group('字符串不可修改');
    console.info(a[1], b[1]);
    try {
      a[1] = 'O';
    } catch (error) {
      console.error('字符串不能修改', error);
    }
    b[1] = 'O';
    console.info(a[1], a.charAt(1), a.charCodeAt(1), b[1]);
    console.groupEnd();

    console.group('字符串不是字符数组');
    // 生成了新字符串
    const c = a.concat('bar');
    const d = b.concat(['b', 'a', 'r']);
    console.info(`c===a:${c === a}`, c, `d===b:${d === b}`, d);
    console.groupEnd();

    console.group('字符串借用数组方法');
    console.info(`Array.prototype.join.call:${Array.prototype.join.call(a, '-')}`);
    console.info(`Array.prototype.map.call:${Array.prototype.map.call(a, v => `${v.toUpperCase()}.`).join('')}`);
    console.info(`Array.prototype.reverse1:${a.split('').reverse().join('')}`);
    console.info(`Array.prototype.reverse2:${Array.from(a).reverse().join('')}`);
    console.groupEnd();
  })();

  // 数字
  (() => {
    const a = 5E+10;
    console.info(a, a.toExponential());
    const b = a * a;
    console.info(b);
    const af = 42.59;
    console.info(af.toFixed(0), af.toFixed(1), af.toFixed(2), af.toFixed(3), af.toFixed(4));
    console.info(`10进制17:${17} 16进制 0x11:${0x11} 8进制 0o21:${0o21} 2进制 0b00010001:${0b00010001}`);

    // 二进制浮点数问题
    console.info(`二进制浮点数问题 0.1+0.2===0.3:${0.1 + 0.2 === 0.3}`);
    // 根据误差范围判断是否相等
    console.info(`二进制浮点数问题 0.1+0.2===0.3:${(0.1 + 0.2) - 0.3 < Number.EPSILON}`);
    console.info(`Number.Max_VALUE:${Number.MAX_VALUE} Number.MAX_SAFE_INTEGERL:${Number.MAX_SAFE_INTEGER} Number.EPSILON:${Number.EPSILON}`);

    // 特殊数字
    const c = 2 / 'NaN';
    console.info(`c:${c} typeof c:${typeof c} isNaN:${isNaN(c)} isNaN缺陷:${isNaN('foo')} es2015 Number.isNaN('foo'):${Number.isNaN('foo')}`);

    // 无穷数
    console.info(Infinity / Infinity, 1 / Infinity, -1 / Infinity);

    // 使用Object.is判断
    const d = -3 * 0;
    const e = 0;
    console.info(Object.is(c, NaN), Object.is(d, -0), Object.is(e, 0));
  })();

  // 值和引用
  (() => {
    function foo(x) {
      x.push(4);
      console.info(x);
      x.length = 0;
      x.push(4, 5, 6, 7);
      console.info(x);
    }
    const a = [1, 2, 3];
    foo(a);
    console.info(a);
  })();
};
