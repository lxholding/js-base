<template>
  <div>
    <div>websocket 测试</div>
    <h3>聊天记录</h3>
    <div>
    </div>
    <div>
      <textarea class="input" rows="8"></textarea>
      <button class="button" @click="send" >发送</button>
    </div>
  </div>
</template>

<style lang="scss">
.input {
  display: block;
  width: 100%;
}
.button {
  margin-top: 10px;
  width: 100px;
  height: 20px;
}
</style>


<script>
const s1 = Symbol('s1');
console.info('websocket', s1);
function MySocket() {
  let ws = null;
  let socketIo = null;
  console.info(typeof WebSocket);
  if (typeof WebSocket === 'undefined') {
    socketIo = io(`http://${document.location.hostname}:8999`);
    console.info('使用Socket.io', socketIo);
    socketIo.on('connect', () => {
      console.info(`socket io connect`);
    });
  } else {
    ws = new WebSocket(`ws://${document.location.hostname}:8999`);
    console.info('使用原生websocket', ws);
  }

  const client = {
    set onopen(func) {
      if (ws) {
        ws.onopen = () => {
          func();
        };
      }
    },
    set onmessage(func) {
      if (ws) {
        ws.onmessage = (data) => {
          func(data);
        };
      }
    }
  };

  return client;
}

const ws = new MySocket();
ws.onopen = () => {
  console.info('ws', 'open');
};

ws.onmessage = (data) => {
  console.info('ws', data);
};

export default {
  methods: {
    send(ev) {
      console.info('send', ev);
      // ws.send('test', ev);
    }
  }
};
</script>
