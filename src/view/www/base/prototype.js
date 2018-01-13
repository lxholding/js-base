export default () => {
  // 原型链
  (() => {
    const AnotherObject = { a: 'AnotherObject a属性' };
    // 创建一个关联到anotherObject的对象
    const obj = Object.create(AnotherObject);
    console.dir(obj);
    console.info(`obj本身没有a属性，会沿着原型链向上查找到AnotherObject中的a属性:${obj.a}，如果没有的话返回:${
      obj.b
    }`);
    for (const k in obj) {
      console.info(`使用 for..in 语法时也会查找原型链:${k}`);
    }
    console.info(`in 操作会查找原型链 a in obj:${'a' in obj}`);
  })();

  // 属性设置和屏蔽
  (() => {
    const parent = {
      a: 'Parent a属性',
      b: 'Parent b属性',
      f: 1,
      g: 'Parent g属性'
    };
    Object.defineProperties(parent, {
      c: {
        value: 'Parent c属性',
        writable: false
      },
      d: {
        configurable: true,
        get() {
          return 'parent 属性d getter';
        },
        set(val) {
          console.info(`parent 属性d setter val:${val}`);
        }
      }
    });
    const child = Object.create(parent, { a: { value: 'child a属性' } });
    child.b = 'child 修改b属性 产生屏蔽';
    console.info(
      '在原型链上层存在b属性并且没有被标记为只读，那就会在child中添加一个名为b的属性，它是屏蔽属性',
      child
    );

    try {
      child.c = 'child 修改c属性';
    } catch (error) {
      console.error(
        '在原型链上层存在c属性并且被标记为只读，在非严格模式下会被忽略，在严格模式下抛出错误，不会产生屏蔽',
        error
      );
    }

    child.d = 'child 修改d属性';
    console.info(
      '如果原型链上存在d属性setter，那就一定会调用setter，不会产生屏蔽',
      `child.d=${child.d}`
    );
    // 重新定义parent属性d
    Object.defineProperty(parent, 'd', {
      get() {
        return 'parent 属性d getter2';
      },
      set(val) {
        console.info(`parent 属性d setter2 val:${val}`);
      }
    });
    console.info(`重新定义parent属性d后child跟着改变，没有产生屏蔽 child.d=${child.d}`, child);

    // 隐式屏蔽
    console.info(`parent.f:${parent.f} child.f:${child.f}`);
    child.f++;
    console.info(`child.f++ 等于 child.f = child.f + 1 在child产生屏蔽属性f，parent.f:${parent.f} child.f:${
      child.f
    }`);
  })();

  // 对象共用函数原型
  (() => {
    function Foo() {}
    Foo.prototype.a = 1;
    const foo = new Foo();
    const foo2 = new Foo();
    console.info(
      '调用new Foo()时会创建一个新对象，这个新对象的的prototype关联到Foo.prototype',
      `Object.getPrototypeOf(foo) === Foo.prototype:${Object.getPrototypeOf(foo) === Foo.prototype}`
    );
    console.info(
      '所有Foo创建的对象都共用Foo.prototype',
      `Object.getPrototypeOf(foo) === Object.getPrototypeOf(foo2):${Object.getPrototypeOf(foo) ===
        Object.getPrototypeOf(foo2)}`
    );
    console.info(foo);
  })();

  // 构造函数
  (() => {
    function Foo() {}
    console.info(`构造函数Foo.prototype.constructor === Foo:${Foo.prototype.constructor === Foo}`);
    const foo = new Foo();
    console.info(`对象构造函数foo.constructor === Foo:${foo.constructor === Foo}`);
  })();

  // 函数本身并不是构造函数，new关键字会劫持所有普通函数并用构造对象的形式来调用它
  (() => {
    function NothingSpecial() {
      console.info('Don`t mind me!');
    }
    const obj = new NothingSpecial();
    console.dir(obj);

    function Foo() {}
    Foo.prototype = {};
    const foo = new Foo();
    console.info(
      '对象的.constructor只是通过委托访问到原型中的constructor',
      `foo.constructor === Foo:${foo.constructor === Foo}`,
      `foo.constructor === Object:${foo.constructor === Object}`
    );

    // 需要在 Foo.prototype 上“修复”丢失的 .constructor 属性
    // 新对象属性起到 Foo.prototype 的作用
    Object.defineProperty(Foo.prototype, 'constructor', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: Foo // 让 .constructor 指向 Foo
    });
    console.info(`手动指定"构造函数" foo.constructor === Foo.prototype.constructor:${foo.constructor ===
        Foo.prototype.constructor}`);
  })();

  // 原型继承
  (() => {
    function Foo(name) {
      this.name = name;
    }
    Foo.prototype.myName = function myName() {
      return this.name;
    };
    Foo.prototype.myLabel = function myLabel() {
      return 'Foo myLabel function';
    };

    function Bar(name, label) {
      Foo.call(this, name);
      this.label = label;
    }

    // 创建了一个新的 Bar.prototype 对象并关联到 Foo.prototype
    Bar.prototype = Object.create(Foo.prototype);
    // 注意!因为.constructor是不可枚举的，所以没有 Bar.prototype.constructor
    // 如果你需要这个属性的话可能需要手动修复一下它
    Bar.prototype.myLabel = function myLabel() {
      return this.label;
    };
    const bar = new Bar('name', 'label');
    console.info(bar, `name:${bar.myName()} label:${bar.myLabel()}`);
  })();

  // 原型继承es2015
  (() => {
    function Foo(name) {
      this.name = name;
    }
    Foo.prototype.myName = function myName() {
      return this.name;
    };
    Foo.prototype.myLabel = function myLabel() {
      return 'Foo myLabel function';
    };

    function Bar(name, label) {
      Foo.call(this, name);
      this.label = label;
    }

    // Bar.prototype 并关联到 Foo.prototype
    // debugger;
    Object.setPrototypeOf(Bar.prototype, Foo.prototype);
    // 不会丢失.constructor
    Bar.prototype.myLabel = function myLabel() {
      return this.label;
    };
    const bar = new Bar('name', 'label');
    console.info(bar, `name:${bar.myName()} label:${bar.myLabel()}`);
  })();

  // es2015类写法
  (() => {
    class Foo {
      name;
      constructor(name) {
        this.name = name;
      }

      myName() {
        return this.name;
      }
    }

    class Bar extends Foo {
      constructor(name, label) {
        super(name);
        this.label = label;
      }

      myLabel() {
        return this.label;
      }
    }
    const bar = new Bar('lee', 'label');
    console.info(`Bar name:${bar.myName()} label:${bar.myLabel()} Bar.prototype instanceof Foo:${Bar.prototype instanceof
        Foo}`);
    console.dir(bar);
  })();

  // 检查对象关系
  (() => {
    function Foo() {}
    function Bar() {}

    const obj = { a: 1 };

    Object.setPrototypeOf(Bar.prototype, Foo.prototype);
    const foo = new Foo();
    const bar = new Bar();
    const FooBind = Foo.bind(obj);

    console.info(
      '使用instanceof操作符可以判断bar的整条原型链中是否有指向Foo.prototype的对象',
      `bar instanceof Bar:${bar instanceof Bar} bar instanceof Foo:${bar instanceof Foo}`,
      `foo instanceof Bar:${foo instanceof Bar} foo instanceof Foo:${foo instanceof Foo}`
    );
    console.info(
      '硬绑定函数没有.prototype属性，Foo的.prototype会代替FooBind',
      `foo instanceof FooBind:${foo instanceof FooBind} bar instanceof FooBind:${bar instanceof
        FooBind}`
    );

    // 判断对象之间的关系
    const objA = { type: 'objA' };
    const objB = Object.create(objA, { type: { value: 'objB' } });
    console.dir(objB);
    console.info(`objA是否出现在objB的原型链中:${objA.isPrototypeOf(objB)} objB.prototype === objA:${Object.getPrototypeOf(objB) === objA}`);
  })();

  // 对象委托机制
  (() => {
    const Foo = {
      init(who) {
        this.me = who;
      },
      identify() {
        return `I am ${this.me}`;
      },
      speak() {
        console.info(`Hello, ${this.identify()}.`);
      }
    };
    const Bar = Object.create(Foo);
    Object.assign(Bar, {
      identify() {
        return `Bar I am ${this.me}`;
      },
      speak() {
        console.info(`Bar Hello，${this.identify()}.`);
      }
    });
    const f1 = Object.create(Foo);
    f1.init('f1');
    f1.speak();
    const b1 = Object.create(Bar);
    b1.init('b1');
    const b2 = Object.create(Bar);
    b2.init('b2');
    b1.speak();
    b2.speak();
  })();

  (() => {
    const Foo = {
      // es2015的函数简洁写法实际上创建了一个匿名函数，所以无法在函数内部引用，使用this调用的话可能会受绑定影响
      func1() {
        // console.info(func1);
      },
      // 当需要在函数内部调用自身时使用具名函数写法
      func2: function func2() {
        console.info(func2);
      }
    };
    Foo.func2();
  })();

  // 使用函数来模拟类的的方式使得类型推断让人困惑
  (() => {
    function Foo() {}
    function Bar() {}
    // Bar.prototype关联到Foo.prototype
    Object.setPrototypeOf(Bar.prototype, Foo.prototype);
    const b1 = new Bar();
    console.info('原型关联方式的内省----');

    // Object作为原型链的根，Object.prototype.__proto__ === null，所以原型链委托查找也就到此为止
    console.info(`Object.prototype.__proto__:${Object.prototype.__proto__}`);
    console.info(`Object.getPrototypeOf(Bar) === Bar.constructor.prototype:${Object.getPrototypeOf(Bar) ===
        Bar.constructor.prototype}`);
    // Object.__proto__指向Function.prototype，Function.prototype.__proto__指向Object.prototype
    // 而且Function.prototype === Function.__proto__
    // 特殊的Function.__proto__ === Function.prototype，其他函数都等于Function.prototype
    // Function.prototype.__proto__ == Object.prototype
    console.info(
      `Function.__proto__ === Function.prototype:${Function.__proto__ === Function.prototype}`,
      `Function.prototype.__proto__ === Object.prototype:${Function.prototype.__proto__ ===
        Object.prototype}`
    );
    // 所有对象都有__proto__属性，函数本身是由new Function()构造的也是对象所以也有__proto__属性
    // 除了Function外所有函数的__proto__属性都指向Function.prototype
    console.info(
      `Foo.__proto__ === Function.prototype:${Foo.__proto__ === Function.prototype}`,
      `Bar.__proto__ === Function.prototype:${Bar.__proto__ === Function.prototype}`,
      `Object.__proto__ === Function.prototype:${Object.__proto__ === Function.prototype}`
    );
    // Bar本身并没有.constructor属性，所以会委托到Bar.__proto__原型链上查找
    // 而Bar.__proto__指向Function.prototype，所以最后会找到Function.prototype.constructor
    // 由于Function.prototype.constructor === Function
    // 所以Foo.constructor.constructor相当于Function.constructor
    // 再由于Function.constructor并不存在，所以会委托到Function.__proto__原型链上查找
    // Function.__proto__ === Function.prototype，所以最后又找到了Function.prototype.constructor上...
    console.info(
      `Bar.constructor === Foo.constructor.constructor:${Bar.constructor ===
        Foo.constructor.constructor}`,
      `Bar.constructor === Function:${Bar.constructor === Function}`
    );

    // Foo和Bar之间通过原型关联
    console.info(`Bar.prototype instanceof Foo:${Bar.prototype instanceof Foo}`);
    console.info(`Object.getPrototypeOf(Bar.prototype) === Foo.prototype:${Object.getPrototypeOf(Bar.prototype) === Foo.prototype}`);
    console.info(`Foo.prototype.isPrototypeOf(Bar.prototype):${Foo.prototype.isPrototypeOf(Bar.prototype)}`);
    // b1关联到Foo和Bar
    console.info(`b1 instanceof Foo:${b1 instanceof Foo}`);
    console.info(`b1 instanceof Bar:${b1 instanceof Bar}`);
    console.info(`Object.getPrototypeOf(b1) === Bar.prototype:${Object.getPrototypeOf(b1) === Bar.prototype}`);
    console.info(`Foo.prototype.isPrototypeOf( b1 ):${Foo.prototype.isPrototypeOf(b1)}`);
    console.info(`Bar.prototype.isPrototypeOf( b1 ):${Bar.prototype.isPrototypeOf(b1)}`);
  })();

  // 使用对象关联的方式更加自然
  (() => {
    console.info('对象关联方式的内省----');

    const Foo = {};
    // Bar原型关联到Foo
    const Bar = Object.create(Foo);
    // b1原型关联到Bar
    const b1 = Object.create(Bar);

    console.info('Object.getPrototypeOf(Bar)');
    console.dir(Object.getPrototypeOf(Bar));
    console.info('Object.getPrototypeOf(b1)');
    console.dir(Object.getPrototypeOf(b1));

    // Foo和Bar的关联判断
    console.info(`Foo.isPrototypeOf(Bar):${Foo.isPrototypeOf(Bar)}`);
    console.info(`Object.getPrototypeOf(Bar) === Foo:${Object.getPrototypeOf(Bar) === Foo}`);

    // b1跟Foo、Bar的关联判断
    console.info(`Foo.isPrototypeOf(b1):${Foo.isPrototypeOf(b1)}`);
    console.info(`Bar.isPrototypeOf(b1):${Bar.isPrototypeOf(b1)}`);
    console.info(`Object.getPrototypeOf(b1):${Object.getPrototypeOf(b1)}`);
  })();

  // es2015 super关键字
  (() => {
    console.info('super关键字----');
    const parent = {
      foo: 'parent.foo',
      find() {
        console.info(`parent find ${this.foo}`);
      }
    };

    const child = {
      foo: 'child.foo',
      find() {
        // super.find() 等同于Object.getPrototypeOf(this).find.call(this)
        // 所以这里的super.find()显示的是child.foo属性
        super.find();
        console.info(`child find ${this.foo}`);
      }
    };

    Object.setPrototypeOf(child, parent);
    child.find();
  })();
};
