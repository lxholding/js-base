export default () => {
  // 寄生继承
  (() => {
    // 传统js类
    function Vehicle() {
      this.engines = 1;
    }
    Object.assign(Vehicle.prototype, {
      ignition() {
        console.info('Vehicle', `启动引擎${this.engines}`);
      },
      drive() {
        this.ignition();
        console.info('Vehicle', '向前开!');
      }
    });

    // 寄生类
    function Car() {
      const car = new Vehicle();

      car.wheels = 4;
      // car.engines = 2;
      // 保存父类drive方法引用
      const vehDrive = car.drive;
      // 重写父类drive方法
      car.drive = function drive() {
        vehDrive.call(this);
        console.info('Car', '4轮滚动!');
      };

      // 返回自定义car对象
      return car;
    }
    const car = Car();
    car.drive();
  })();

  (() => {
    // 隐式混入
    const Something = {
      cool() {
        this.greeting = 'Hello World';
        this.count = this.count ? this.count + 1 : 1;
      }
    };

    Something.cool();
    console.info('Something:', Something);
    const Another = {
      cool() {
        // 隐式把 Something 混入 Another,count和greeting独立
        Something.cool.call(this);
      }
    };
    Another.cool();
    console.info('Another', Another);
  })();

  // es2015新加入的class关键字只是一个语法糖
  (() => {
    class A {
      count = 0;
      constructor() {
        // 相当于静态变量
        A.prototype.count++;
        this.count++;
        this.x = 1;
        this.y = 1;
      }

      show() {
        console.info(`A.prototype.count:${A.prototype.count} count:${this.count} x:${this.x} y:${this.y}`);
      }
    }

    A.prototype.count = 0;
    const a1 = new A();
    a1.show();
    const a2 = new A();
    a2.show();
    // a1就是一个用new调用的普通函数
    console.dir(a1);
    // 实际上A就是一个普通函数
    console.dir(A);
    console.info(`A就是一个普通函数，A === A.prototype.constructor:${A === A.prototype.constructor}`);
  })();
};
