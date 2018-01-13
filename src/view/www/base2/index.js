import axios from 'axios';
// import typeModel from './type';
// import valueModel from './value';
import nativeFunc from './nativeFunc';
// import typeCasting from './typeCasting';
// import grammar from './grammar';
import promise from './promise';
import generator from './generator';
// import worker from './worker';

// ajax请求测试
function request(tag, url) {
  console.info(tag, 'ajax', url);
  return axios.get(encodeURI(url));
}
// console.group('类型');
// typeModel();
// console.groupEnd();

// console.group('值');
// valueModel();
// console.groupEnd();

console.group('原生函数');
nativeFunc();
console.groupEnd();

// console.group('强制类型装换');
// typeCasting();
// console.groupEnd();

// console.group('语法');
// grammar();
// console.groupEnd();

console.group('promise');
promise();
console.groupEnd();

console.group('generator');
generator(request);
console.groupEnd();

// console.group('worer');
// worker(request);
// console.groupEnd();
