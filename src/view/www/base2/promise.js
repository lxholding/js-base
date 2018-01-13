import axios from 'axios';
import Promise from 'core-js/es6/promise';

export default () => {
  (() => {
    const p1 = new Promise((resolve, reject) => {
      // setTimeout(() => {
      console.info('p1 resolve');
      resolve('p1');
      // }, 1000);
    });
    p1.then((val) => {
      console.info('Promise的回调总是异步的', 'p1 resolve then');
    });

    const p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.info('p2 resolve');
        resolve('p2');
      }, 2000);
    });

    Promise.all([p2, p1]).then((vals) => {
      console.info('获取到的返回值顺序和输入顺序相同', vals);
    });

    const p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.info('p3 reject');
        reject(Error('p3'));
      }, 1000);
    });

    const p4 = new Promise((resolve, reject) => {
      // setTimeout(() => {
      console.info('p4 reject');
      reject(Error('p4'));
      // }, 2000);
    });
    p4.catch((error) => {
      console.info('Promise的回调总是异步的', 'p4 reject catch');
    });

    Promise.all([p3, p4])
      .then((vals) => {
        console.info(vals);
      })
      .catch((error) => {
        console.error('只会捕获到第一个抛出的异常', error);
      });

    // 含有then方法的对象会被识别为Promise
    const thenAble = {
      then(resolve, reject) {
        console.info('含有then方法的对象会被识别为Promise');
        resolve('thenAble');
      }
    };
    Promise.all([thenAble]).then((vals) => {
      console.info(vals);
    });
  })();

  (() => {
    var p3 = new Promise((resolve, reject) => {
      console.info('p3 resolve B');
      resolve('B');
    });
    var p1 = new Promise((resolve, reject) => {
      console.info('p3展开到p1是异步的', 'p1 resolve p3');
      // 展开p3 Promise
      resolve(p3);
    });
    var p2 = new Promise((resolve, reject) => {
      console.info('p2 resolve A');
      reject(Error('A'));
    });

    p1.then((v) => {
      console.info(v);
    });

    p2
      .then((v) => {
        console.info(v);
      })
      .catch((error) => {
        console.error('p2 error2', error);
      });
  })();

  // Promise 超时
  (() => {
    const delay = 1000;
    const delay2 = 0;

    const p1 = new Promise((resolve, reject) => {
      console.info('p1 只会被执行一次');
      console.info('p1 start');
      setTimeout(() => {
        console.info('p1 resolve');
        resolve(`p1 成功:${delay}`);
      }, delay);
    });

    const p2 = new Promise((resolve, reject) => {
      console.info('p2 只会被执行一次');
      console.info('p2 start');
      setTimeout(() => {
        console.info('p2 resolve');
        resolve(`p2 成功:${delay2}`);
      }, delay2);
    });

    function promiseTimeout(delay) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(Error(`timeout:${delay}`));
        }, delay);
      });
    }
    p1.then((val) => {
      console.info(`p1 then:${val}`);
    });

    const pRace = Promise.race([p1, p2]);
    pRace
      .then((val) => {
        console.info('Promise.race 结果为先执行完成的promise', val);
      })
      .catch((error) => {
        console.error(error);
      });
    pRace
      .then((val) => {
        console.info('Promise完成后在调用时非异步', val);
      })
      .catch((error) => {
        console.error(error);
      });

    Promise.race([p1, promiseTimeout(500)])
      .then((val) => {
        console.info(val);
      })
      .catch((error) => {
        console.error(error);
      });

    Promise.race([p1, promiseTimeout(1000)])
      .then((val) => {
        console.info(val);
      })
      .catch((error) => {
        console.error(error);
      });
  })();

  // 抛出异常
  (() => {
    var p = new Promise((resolve, reject) => {
      foo.bar(); // foo未定义，所以会出错!
      resolve(42); // 永远不会到达这里 :(
    });
    p.then(
      () => {
        // 永远不会到达这里 :(
      },
      (error) => {
        // err将会是一个TypeError异常对象来自foo.bar()这一行
        console.error('捕获到TypeError异常对象来自foo.bar()这一行', error);
      }
    );

    // 捕获在then中抛出的异常
    var p2 = new Promise((resolve, reject) => {
      resolve(42);
    });
    p2
      .then(
        (msg) => {
          foo.bar();
          console.info(msg); // 永远不会到达这里 :(
        },
        (error) => {
          // 只能捕获到promise执行时的异常，无法捕获then中抛出的异常，所以永远也不会到达这里 :(
          console.error(error);
        }
      )
      .catch((error) => {
        console.error('使用cache语法才能捕获到then中抛出的异常', error);
      });
  })();

  // Promise信任问题
  (() => {
    const p1 = new Promise((resolve, reject) => {
      resolve(42);
    });
    const p2 = Promise.resolve(42);
    Promise.all([p1, p2]).then((vals) => {
      console.info(vals);
    });

    // 如果传入的是Promise对象则直接返回
    const p3 = Promise.resolve(42);
    const p4 = Promise.resolve(p3);
    console.info(`p3 === p4:${p3 === p4}`);

    // thenable 例1
    const thenAble = {
      then(resolve, reject) {
        resolve('普通thenable对象转为Promise');
        reject('转换后不会执行到reject');
      }
    };
    // 如果传入的是thenable对象则先展开后再将值封装为Promise
    const thenAblePromise = Promise.resolve(thenAble);
    thenAblePromise
      .then((val) => {
        console.info('thenable then', val);
      })
      .catch((error) => {
        console.error('thenable catch', error);
      });
    console.info(thenAble, thenAblePromise);

    // thenable 例2
    function foo(val) {
      return {
        then(cb, cberr) {
          cb(val);
          cberr(val);
        }
      };
    }

    Promise.resolve(foo(42)).then((val) => {
      console.info(`用Promise展开thenable并将值封装为Promise:${val}`);
    });
  })();

  // Promise链式流
  (() => {
    const p = Promise.resolve(21);
    p
      .then((v) => {
        console.info(`v1:${v} 直接返回值`);
        return v * 2;
      })
      .then((v) => {
        console.info(`v2:${v}`);
      });

    const p2 = Promise.resolve(21);
    p2
      .then((v) => {
        console.info(`v3:${v} 将返回值封装为Promise`);
        return new Promise((resolve, reject) => {
          resolve(v * 2);
        });
      })
      .then((v) => {
        console.info(`v3:${v} 获取到自动展开的Promise值`);
      });

    const p3 = Promise.resolve(21);
    p3
      .then((v) => {
        console.info(`v4:${v} 将返回值封装为Promise并加入异步`);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(v * 2);
          }, 2000);
        });
      })
      .then((v) => {
        console.info(`v5:${v} 获取到自动展开的Promise异步值`);
      });

    const p4 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(Error('异步抛出异常'));
      }, 10000);
    });

    p4.then(null, (error) => {
      console.error('只处理异常', error);
    });

    // 延迟工具测试
    function delay(time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(time);
        }, time);
      });
    }

    delay(700)
      .then((val) => {
        console.info(`step 2 (after ${val}ms)`);
        return delay(val + 100);
      })
      .then((val) => {
        console.info(`step 3 (after ${val}ms)`);
        return delay(val + 100);
      })
      .then((val) => {
        console.info(`step 4 (after ${val}ms)`);
        return delay(val + 100);
      })
      .then((val) => {
        console.info(`step 4 (after ${val}ms)`);
        return delay(val + 100);
      });

    // ajax请求测试
    function request(url) {
      console.info(url);
      return axios.get(url);
    }

    request('/api/1')
      .then(v => request(v.data.url))
      .then((v) => {
        console.info(v.data.data, v);
      });

    // resolve方法会自动展开值
    const rejectedPr = new Promise((resolve, reject) => {
      resolve(Promise.reject('由resolve展开的reject Promise'));
    });
    rejectedPr.then(
      (val) => {
        // 永远不会到达这里
      },
      (error) => {
        console.error('接收到由resolve展开的错误，所以resolve实际结果可能是完成或拒绝', error);
      }
    );

    // reject不会自动展开，而会把值直接返回
    const p6 = new Promise((resolve, reject) => {
      reject(new Promise((resolve, reject) => {
        resolve('由reject返回的Promise resolve值');
      }));
    });
    p6.then(
      (val) => {},
      (promise) => {
        console.info(promise);
        promise.then((val) => {
          console.info(val);
        });
      }
    );

    // 无法捕获异步错误
    const p7 = new Promise((resolve, reject) => {
      setTimeout(() => {
        foo.bar();
      }, 1000);
    });
    try {
      p7
        .then(
          (val) => {
            console.info(val);
          },
          (error) => {
            console.error('promise错误处理函数也无法捕获异步错误', error);
          }
        )
        .catch((error) => {
          console.error('promise catch中也无法捕获异步错误', error);
        });
    } catch (error) {
      console.error('try..catch 无法捕获异步错误', error);
    }

    window.onerror = function (msg, scriptURI, lineNumber, columnNumber, errorObj) {
      console.error('全局错误捕获', msg, scriptURI, lineNumber, columnNumber, errorObj);
      // 返回true不抛出错误
      // 如果没有错误详情则继续抛出错误方便调试
      return !!errorObj;
    };

    const allError = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(Error('Promise抛出异步错误'));
      }, 5000);
    });
    const all1 = request('/api/1');
    const all2 = request('/api/3');
    Promise.all([all1, all2, allError])
      .then((vals) => {
        console.info('Promise.all', vals);
        return request(vals[0].data.url);
      })
      .then((val) => {
        console.info('Promise.all', val);
      })
      .catch((error) => {
        console.info('Promise.all', error);
      });
    Promise.race([all1, all2, allError])
      .then((val) => {
        console.info('Promise.race', val);
      })
      .catch((error) => {
        console.info('Promise.race', error);
      });

    // 空数组不会有任何结果，永远不要传入空数组到Promise.race
    Promise.race([])
      .then((val) => {
        console.info('Promise.race 空数组不会有任何结果', val);
      })
      .catch((error) => {
        console.info('Promise.race 空数组不会有任何结果', error);
      });

    // es2015解构方式1
    Promise.all([all1, all2]).then((vals) => {
      const [v1, v2] = vals;
      console.info('es2015解构方式1', v1, v2);
    });

    // es2015解构方式2
    Promise.all([all1, all2]).then(([v1, v2]) => {
      console.info('es2015解构方式2', v1, v2);
    });
    console.info('Array.slice', [1, 2, 3].slice());
  })();

  // 用Promise封装旧异步方法
  (() => {
    // 只有显示引入Promise才不会被babel转码，导致无法添加自定义方法
    Promise.wrap = function (fn) {
      return function (...args) {
        return new Promise((resolve, reject) => {
          console.info('Promise.wrap', args);
          fn.apply(
            null,
            args.concat((err, v) => {
              if (err) {
                reject(err);
              } else {
                resolve(v);
              }
            })
          );
        });
      };
    };
    // 使用babel的polyfill后被转码，所以无法直接扩展Promise
    // polyfill安全的guard检查
    function PromiseWrap(fn) {
      return function (...args) {
        return new Promise((resolve, reject) => {
          console.info('Promise.wrap', args);
          fn.apply(
            null,
            args.concat((err, v) => {
              if (err) {
                reject(err);
              } else {
                resolve(v);
              }
            })
          );
        });
      };
    }

    function foo(x, y, cb) {
      setTimeout(() => {
        if (x > y) {
          cb(null, x);
        } else {
          cb('must x > y');
        }
      }, 1000);
    }

    const fooWrap = Promise.wrap(foo);
    fooWrap(2, 1).then(
      (val) => {
        console.info('Promise.wrap', val);
      },
      (error) => {
        console.error('Promise.wrap', error);
      }
    );

    fooWrap(1, 2).then(
      (val) => {
        console.info('Promise.wrap', val);
      },
      (error) => {
        console.error('Promise.wrap', error);
      }
    );
  })();
};
