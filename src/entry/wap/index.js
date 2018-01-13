import app from 'app'
import Vue from 'vue'
// import axios from 'axios'
import route from './route'
import store from './store'
import App from '../App.vue'

app.start({
  vue: null,
  /**
   * 应用初始化方法
   */
  init() {
    const router = route(this)
    this.routerInit(router)

    // Vue初始化
    const vue = new Vue({
      router,
      store: store(this),
      render: h => h(App)
    })

    // 挂载到元素
    router.onReady(() => {
      // console.log('router onReady')
      vue.$mount('#app')
    })

    this.vue = vue
  }
})
