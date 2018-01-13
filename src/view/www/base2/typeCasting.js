export default () => {
  // ToString
  console.group('ToString');
  (() => {
    const obj1 = {
      a: 'a',
      toString() {
        return '自定义toString';
      }
    };

    console.info(obj1, `${obj1}`);
    const number = 1.07 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000;
    console.info('数字转字符串', `${number}`);

    console.group('json字符串');
    const json1 = {
      a: 1,
      b: 2
    };
    const json2 = {
      d: 3,
      e: 4,
      f: json1
    };
    const json3 = {
      g: 5,
      h: 6,
      i: json1
    };
    json1.c = json2;
    json1.z = json3;

    try {
      console.info(JSON.stringify(json1));
    } catch (error) {
      console.error('JSON.stringify()方法不支持循环引用', error);
    }
    json2.toJSON = function () {
      return {
        d: this.d,
        e: this.e
      };
    };
    console.info('自定义toJSON方法避免循环引用问题', JSON.stringify(json1, ['a', 'b', 'c', 'd', 'e']));
    console.info('自定义toJSON方法避免循环引用问题2', JSON.stringify(json1, ['a', 'b', 'c', 'd']));
    console.info('序列化指定属性', JSON.stringify(json1, ['a', 'b']));
    console.info('序列化指定属性2', JSON.stringify(json1, (k, v) => {
      console.info(`k:${k} v:${v}`);
      if (k && v === json1) {
        return undefined;
      }
      return v;
    }));
    console.groupEnd();
  })();
  console.groupEnd();

  console.group('ToNumber');
  (() => {
    const a = {
      valueOf() {
        return '42';
      },
      toString() {
        return '32';
      }
    };
    const b = {
      toString() {
        return '42';
      }
    };
    const c = [4, 2];
    c.toString = function () {
      return this.join('');
    };
    const d = [];
    Object.assign(d, {
      valueOf() {
        return '1';
      },
      toString() {
        return '2';
      }
    });
    console.info(Number(a), Number(b), Number(c), Number(d), Number([]), Number(undefined), Number(null), Number(''), Number(['abc']), Number(['1']), Number(['1a']), Number(['0x11']));
  })();
  console.groupEnd();

  console.group('ToBoolean');
  (() => {
    console.info(Boolean(undefined), Boolean(null), Boolean(false), Boolean(0), Boolean(-0), Boolean(NaN), Boolean(''));
    console.info(Boolean([]), Boolean({}), Boolean(' '));
    const a = new Boolean(false);
    const b = new Number(0);
    const c = new String('');
    const d = new Boolean(a && b && c);
    console.info(d, false && 0 && '');
  })();
  console.groupEnd();

  console.group('显示强制类型转换');
  (() => {
    const a = 42;
    const b = String(a);
    let c = '3.14';
    const d = Number(c);
    const e = +c;
    const f = a.toString();
    const g = -c;
    const h = --c;
    const i = '3.14';
    const j = - -i;
    console.info(a, b, c, d, e, f, g, h, j);
    // 日期强制类型转换
    console.info(+new Date(), new Date().getTime(), Date.now());

    // ~运算符
    console.info(~42, ~0, ~-1);
    const k = 'Hello World';
    console.info(~k.indexOf('ll'), ~k.indexOf('H'), ~k.indexOf('lll'));

    // 显示解析数字字符串
    const a2 = '42';
    const b2 = '42px';
    console.info(Number(a2), parseInt(b2), Number(b2));
    console.info(parseInt(true), parseInt('09'), parseInt('0X11'));
    console.info(parseInt(new String('42')));
    console.info(parseInt(1 / 0, 19), parseInt(1 / 0, 20));
    const c2 = {
      num: 21,
      toString() {
        return String(this.num * 2);
      }
    };
    console.info(parseInt(c2));

    // 显示转换为布尔值
    const a3 = '0';
    const b3 = [];
    const c3 = {};
    const d3 = '';
    const e3 = 0;
    const f3 = -0;
    const g3 = NaN;
    const h3 = null;
    let i3;

    console.info(!!a3, !!b3, !!c3, !!d3, !!e3, !!f3, !!g3, !!h3, !!i3);
  })();
  console.groupEnd();

  console.group('字符串和数字之间的隐式强制类型转换');
  (() => {
    const a = '42';
    const b = 0;
    const c = 42;
    const d = 0;
    const e = [1, 2];
    const f = [3, 4];
    console.info(a + b, c + d, e + f);
    console.info([] + {}, {} + []);

    const g = {
      valueOf() {
        return 42;
      },
      toString() {
        return 4;
      }
    };
    console.info(`${g}`, String(g));

    const h = '3.14';
    console.info(h - 0, h * 1, h / 1, [3] - [0], [3, 0] - [0]);
  })();
  console.groupEnd();

  console.group('布尔值到数字的隐式强制类型转换');
  (() => {
    function onlyOne(...args) {
      return args.reduce((sum, val) => sum + val, 0) == 1;
    }
    console.info(
      onlyOne(true, false),
      onlyOne(true, false, false, false, false),
      onlyOne(true, false, false, true)
    );
  })();
  console.groupEnd();

  console.group('隐式强制类型转换为布尔值');
  (() => {
    const a = 42;
    const b = 'abc';
    let c;
    const d = null;
    let e;
    if (a) {
      console.info('yep');
    }
    while (c) {
      console.info('nope, never runs');
    }
    c = d ? a : b;
    console.info(c);
    if ((a && d) || c) {
      console.info('yep');
    }

    c = null;
    // 遇到第一个真值返回，全部为假时返回最后一个
    console.info(a || b, c || b, c || d, d || e);
    // 遇到第一个假值时返回，全部为真时返回最后一个
    console.info(a && b, c && b, c && d, d && e);
    console.info(e || e || c);
    console.info(a && e && a, a && a && b);
  })();
  console.groupEnd();
};
