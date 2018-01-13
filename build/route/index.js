const util = require('util');

const timeoutPromise = util.promisify(setTimeout);

module.exports = (app) => {
  app.get('/api/error', (req, res) => {
    const { msg = null } = req.query;
    console.info(req.url, req.params, `msg:${msg}`);
    res.status(500).send({
      error: msg
    });
  });

  app.get('/api/:v', (req, res) => {
    console.info(req.url, req.params);
    switch (req.params.v) {
      case '1':
        res.send({ url: '/api/2' });
        break;
      case '2': {
        res.send({
          data: '请求2'
        });
        break;
      }
      case '3': {
        res.send({
          data: '请求3'
        });
        break;
      }
      default:
        console.info('default');
        break;
    }
  });

  app.get('/api/sleep/:time', (req, res) => {
    const sleep = req.params.time;
    const { tag = null } = req.query;
    console.info(req.url, req.params, `sleep:${sleep} tag:${tag}`);
    timeoutPromise(sleep).then((val) => {
      res.send({
        data: `tag:${tag} 休眠请求${sleep / 1000}s`
      });
    });
  });

  app.get('/api/return/:v', (req, res) => {
    const { v } = req.params;
    console.info(req.url, req.params, `v:${v}`);
    timeoutPromise(2000).then((val) => {
      res.send(v);
    });
  });
};
