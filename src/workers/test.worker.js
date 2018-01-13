import 'core-js/es6/promise';
import axios from 'axios';

/* eslint no-restricted-globals:off */
const TAG = 'test.worker';
console.info(TAG, 'init');

function request(url) {
  console.info(TAG, 'ajax', url);
  return axios.get(encodeURI(url));
}

self.onmessage = (event) => {
  console.info(TAG, 'message', JSON.stringify(event.data));
};

/* self.addEventListener('message', (event) => {
  console.info('test.worker message', JSON.stringify(event.data));
}); */

self.postMessage({
  worker: TAG,
  data: {
    a: 1,
    b: [1, 2, 3],
    c: {
      d: 'd',
      e: 'e'
    }
  }
});

self.onerror = (...args) => {
  console.error(TAG, 'onerror', args);
};

async function test(tag) {
  const res = await request('/api/return/1');
  console.info(TAG, 'test res', res);
  return {
    worker: TAG,
    tag,
    data: res.data
  };
}

test('test')
  .then((res) => {
    console.info(TAG, 'test then', 'data', JSON.stringify(res.data));
    self.postMessage({
      worker: TAG,
      data: res.data
    });
  })
  .catch((error) => {
    console.error(TAG, 'test catch', error);
  });

async function test2() {
  try {
    const data = await test('test2');
    console.info(TAG, 'test2 data', data);
    self.postMessage(data);
  } catch (error) {
    console.error(TAG, 'test2 catch', error);
  }
}

test2();

console.info(TAG, 'init end');
