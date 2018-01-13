/* eslint no-unused-expressions:off */
/* eslint no-new-wrappers:off */
/* eslint no-new-object:off */
/* eslint dot-notation:off */
/* eslint no-use-before-define:off */
/* eslint no-var:off */
/* eslint vars-on-top:off */
export default () => {
  console.info(myObj3);
  // 对象声明语法
  const myObj = { attr: 'value' };
  const myObj2 = new Object();
  myObj2.attr = 'value';
  console.info(myObj, myObj['attr'], myObj2, myObj2['attr']);

  // 基础类型
  const types = ['string', 1, true, null, undefined, {}];
  for (let i = 0; i < types.length; i++) {
    console.info(`基础类型: ${typeof types[i]}`);
  }

  // 内置对象
  const innerObjects = [String, Number, Boolean, Object, Function, Array, Date, RegExp, Error];
  for (let i = 0; i < innerObjects.length; i++) {
    console.info(`内置对象: ${innerObjects[i]}`);
  }

  // string字面量，不是对象
  const strPrimitive = 'I am a string';
  console.info(`string字面量类型:${typeof strPrimitive} 是否String对象:${strPrimitive instanceof String}`);
  // string对象
  const strObject = new String('I am a string');
  console.info(`new String类型:${typeof strObject} 是否String对象:${strObject instanceof
      String} 子类型:${Object.prototype.toString.call(strObject)}`);

  // 在对象中属性名永远是字符串
  const myObj4 = {};
  myObj4[true] = 'foo';
  myObj4[3] = 'bar';
  myObj4[myObj4] = 'baz';
  console.info(
    `在对象中属性名永远是字符串 ${myObj4['true']} ${myObj4['3']} ${myObj4['[object Object]']}`,
    myObj4
  );

  // 动态属性名
  const prefix = 'foo';
  const myObj3 = {
    [`${prefix}bar`]: 'hello',
    [`${prefix}baz`]: 'world'
  };
  console.info(myObj3);

  // 对象中的函数和普通函数没有区别
  const myObj5 = {
    a: 'myObj5 a变量',
    foo() {
      console.info('myObj5 this:', this);
    }
  };
  myObj5.foo();
  const myObj5Foo = myObj5.foo;
  myObj5Foo();

  // 数组
  const myArray = ['foo', 42, 'bar'];
  myArray['baz'] = 'baz';
  myArray['3'] = '如果用数字字符串作为属性名会变成一个数组下标';
  myArray['4.1'] = '小数字符串不会变成数组下标';
  myArray['0.1'] = '小数字符串不会变成数组下标';
  console.info(
    `数组也是一个对象，可以附加属性,不影响数组 myArray.length:${myArray.length}`,
    myArray,
    myArray.concat([])
  );
  myArray.forEach((val, i) => {
    console.info(`myArray[${i}]=${val}`);
  });

  // 属性描述符
  var myObj6 = {
    a: 'a属性值',
    b: 'b属性值'
  };
  console.info('对象默认属性描述符', Object.getOwnPropertyDescriptor(myObj6, 'a'));

  Object.defineProperty(myObj6, 'a', {
    value: '修改属性a的属性描述符',
    writable: false, // 不可写
    configurable: false, // 不可配置
    enumerable: false // 不可枚举
  });
  Object.defineProperty(myObj6, 'b', {
    writable: false, // 不可写
    configurable: false // 不可配置
  });
  console.info('修改对象属性描述符', Object.getOwnPropertyDescriptor(myObj6, 'a'));

  try {
    myObj6.a = '不可修改';
  } catch (error) {
    console.error(error);
  }
  try {
    Object.defineProperty(myObj6, 'a', { value: '不可配置' });
  } catch (error) {
    console.error(error);
  }
  console.info('不可枚举', Object.keys(myObj6));

  // Object.assign浅拷贝可枚举的对象属性
  const myObj6Clone = Object.assign({}, myObj6);
  console.info(
    '克隆对象，注意原对象属性描述符不会复制',
    Object.getOwnPropertyDescriptor(myObj6Clone, 'b')
  );

  // 不可变对象
  const myObj7 = {
    a: 'a',
    b: 'b'
  };

  Object.preventExtensions(myObj7);
  try {
    myObj7.c = 'c';
  } catch (error) {
    console.error('禁止扩展', error);
  }

  Object.seal(myObj7);
  try {
    delete myObj7.a;
  } catch (error) {
    console.error('封印', error);
  }

  Object.freeze(myObj7);
  try {
    myObj7.a = '冻结对象属性不可修改';
  } catch (error) {
    console.error('冻结', error);
  }

  const myObj8 = { a: undefined };

  /* eslint no-undef:off */
  try {
    console.info(noDefVar);
  } catch (error) {
    console.error('引用词法作用域中的未定义变量', error);
  }
  console.info('引用对象中不存在的属性', myObj8.b);
  console.info(`myObj8 存在属性a:${'a' in myObj8}或者${Object.prototype.hasOwnProperty.call(
    myObj8,
    'a'
  )} 存在属性b:${'b' in myObj8}或者${Object.prototype.hasOwnProperty.call(myObj8, 'b')}`);

  // 属性描述符
  const myObj9 = {
    // 给a定义一个getter
    get a() {
      return 'a属性get访问描述符返回值';
    },
    get c() {
      return this.$c;
    },
    set c(val) {
      console.info(`c属性setter赋值 old:${this.$c} new:${val}`);
      this.$c = val;
    }
  };
  Object.defineProperty(myObj9, 'b', {
    get() {
      return `${this.a} b属性get访问描述符返回值`;
    },
    configurable: true, // 默认false
    enumerable: true // 默认false
  });
  console.info(
    myObj9,
    Object.keys(myObj9),
    Object.getOwnPropertyDescriptor(myObj9, 'a'),
    Object.getOwnPropertyDescriptor(myObj9, 'b')
  );

  try {
    myObj9.b = 4;
  } catch (error) {
    console.error('没有定义属性setter无法修改属性值', error);
  }

  myObj9.c = '修改c属性';

  // 遍历
  /* eslint guard-for-in:off */
  /* eslint no-restricted-syntax:off */
  const myArray2 = [1, 2, 3];
  myArray2.bar = 'bar';
  myArray2.foo = function foo() {};
  for (const val in myArray2) {
    console.info(
      '数组遍历 for..in 语法不适合用于数组遍历，这里的val是数组的下标，而且会带上数组对象中的其他附加属性 val:',
      val
    );
  }
  myArray2.forEach((val, i, array) => {
    console.info(`数组遍历 forEach val:${val} i:${i}`, array);
  });
  myArray2.every((val, i, array) => {
    console.info(`数组遍历 every val:${val} i:${i}`, array);
    return i < 1;
  });
  myArray2.some((val, i, array) => {
    console.info(`数组遍历 some val:${val} i:${i}`, array);
    return i === 1;
  });

  // es2015数组遍历方法
  for (const val of myArray2) {
    console.info(`数组遍历 for...of val:${val}`);
  }

  // 手动调用数组iterator遍历方法
  const it = myArray2[Symbol.iterator]();
  let data;
  do {
    data = it.next();
    console.info('手动调用数组迭代器', data);
  } while (!data.done);

  // 自定义对象迭代器
  const myObj10 = {
    a: 2,
    b: 3
  };
  Object.defineProperty(myObj10, Symbol.iterator, {
    value() {
      // 对象上下文
      const o = this;
      // 属性数量计数器
      let idx = 0;
      // 对象属性列表
      const ks = Object.keys(o);
      return {
        next() {
          return {
            value: o[ks[idx++]],
            done: idx > ks.length
          };
        }
      };
    }
  });
  for (const val of myObj10) {
    console.info(`使用自定义迭代器遍历对象属性值 val:${val}`);
  }
  const objIt = myObj10[Symbol.iterator]();
  let objData;
  do {
    objData = objIt.next();
    console.info('手动调用对象迭代器', objData);
  } while (!objData.done);
};
