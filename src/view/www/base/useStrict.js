export default () => {
  let o = Object.create(null, { x: { value: 'test' } });
  console.info(o);
  console.info('keys:', Object.keys(o));

  try {
    delete o.x;
  } catch (error) {
    console.group('对象属性默认不允许删除');
    console.error(error);
    console.groupEnd();
  }

  try {
    o.x = '属性默认只读';
  } catch (error) {
    console.group('对象属性默认只读');
    console.error(error);
    console.groupEnd();
  }

  console.info('对象属性默认不可遍历', `keys:${Object.keys(o)}`);

  // 设置了configurable才能删除
  o = Object.create(null, {
    x: {
      value: 'test',
      // 允许删除
      configurable: true,
      // 允许遍历
      enumerable: true,
      // 允许修改
      writable: true
    }
  });

  console.group('修改设置后才能操作');
  console.info(Object.keys(o));
  o.x = '修改后的值';
  console.info(o);
  delete o.x;
  console.info(o);
  console.groupEnd();

  // 可以设置getter和setter,不可和value、writable同时设置
  const getSet = Object.create(o, {
    x1: {
      get() {
        console.info('get value');
        return this.x;
      },
      set(v) {
        console.info(`set value:${v}`);
        this.x = v;
      }
    }
  });

  console.group('设置getter和setter');
  getSet.x1 = 'setter值';
  console.info(getSet, getSet.x1);
  console.groupEnd();

  // 严格模式下8进制表示方法
  const num = 10;
  const num8 = 0o10;
  const num16 = 0x10;
  console.info(`10进制:${num} 8进制${num8} 16进制:${num16}`);
};
