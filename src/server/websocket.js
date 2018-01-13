// const http = require('http');
const WebSocket = require('ws');

// const server = http.createServer((req, res) => {
//   const body = http.STATUS_CODES[426];

//   res.writeHead(426, {
//     'Content-Length': body.length,
//     'Content-Type': 'text/plain',
//     'Access-Control-Allow-Origin': 'http://localhost:8011'
//   });
//   res.end(body);
// });

const wss = new WebSocket.Server({ port: 8999 }, () => {
  console.info('WebSocket 服务已启动.');
});

wss.on('headers', (...args) => {
  console.info('headers', Object.keys(args));
});

wss.on('connection', function connection(ws) {
  console.info('connection');
  ws.on('message', function incoming(message) {
    console.info('received: %s', message);
  });

  ws.send('something');
});

// server.listen({ port: 8999 }, () => {
//   console.info('WebSocket 服务已启动.');
// });

