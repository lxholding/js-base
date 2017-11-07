import 'core-js/es6/promise'
import app from 'app'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
// import axios from 'axios'
import route from './route'
import store from './store'
import App from '../App.vue'
import './base/index'

app.start({
  vue: null,
  /**
   * 应用初始化方法
   */
  init() {
    const router = route(this)
    this.routerInit(router)
    const storer = store(this)
    // Vue初始化
    const vue = new Vue({
      router,
      store: storer,
      render: h => h(App)
    })

    sync(storer, router)

    // 挂载到元素
    router.onReady(() => {
      console.warn('router onReady')
      vue.$mount('#app')
    })

    this.vue = vue
  }
})
