import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import * as filters from 'filter'

/* global ENV */

// Vue全局设置
// 取消 Vue 所有的日志与警告
Vue.config.silent = !ENV.isDev
// 是否允许devtools检查代码
Vue.config.devtools = ENV.isDev

/**
 * 注册过滤器
 */
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

VueRouter.prototype.go = function go(number) {
  if (number < 0) {
    this.isBack = true
  }
  this.history.go(number)
}

/**
 * 注册路由插件
 */
Vue.use(VueRouter)

/**
 * 注册Vuex插件
 */
Vue.use(Vuex)

// 注册一个全局自定义指令 v-visible
Vue.directive('visible', {
  // 当绑定元素插入到 DOM 中。
  inserted(el, binding) {
    // console.log('inserted', el, binding)
    el.style.visibility = binding.value ? 'visible' : 'hidden'
  },
  update(el, binding) {
    // console.log('update', el, binding)
    el.style.visibility = binding.value ? 'visible' : 'hidden'
  }
})

const app = {
  start(options) {
    Object.assign(this, options)
    this.init()
  },
  routerInit(router) {
    router.beforeEach((to, from, next) => {
      if (
        !this.beforeRoute({
          router,
          to,
          from,
          next
        })
      ) {
        next()
      }
    })

    router.afterEach((to, from) => {
      this.afterRoute({ to, from })
    })
  },
  /**
   * 路由开始事件
   * @param {*} to
   * @param {*} from
   * @param {*} next
   * @return 返回true代表已接管next，false表示未接管next
   */
  beforeRoute(to, from, next) {
    return false
  },
  /**
   * 路由后事件
   * @param {*} to
   * @param {*} from
   */
  afterRoute(to, from) {}
}

// 将App注册到Vue实例变量中
Vue.prototype.$app = app
global.app = app

export default app
