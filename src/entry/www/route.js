import VueRouter from 'vue-router'

const Index = require('view/www/index.vue')

export default function (app) {
  const router = new VueRouter({
    routes: [
      {
        path: '/',
        component: Index
      }
    ]
  })

  return router
}
