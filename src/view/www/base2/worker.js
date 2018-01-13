/* eslint import/no-extraneous-dependencies:off */
/* eslint import/no-unresolved:off */
import Worker from 'workers/test.worker';

export default (ajax) => {
  const worker = new Worker();
  worker.postMessage({
    client: 'worker client',
    data: {
      a: 1,
      b: [1, 2, 3]
    }
  });
  worker.onmessage = function (event) {
    const data = JSON.stringify(Object.assign({}, event.data));
    console.info('worker client onmessage', data);
    alert(data);
  };
  // worker.addEventListener('message', (event) => {
  //   console.info('worker client onmessage2', event);
  // });
};
