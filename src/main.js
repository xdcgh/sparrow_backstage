import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 全局样式
import './assets/css/global.css'

Vue.config.productionTip = false

// axios 配置
import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.31.15:8080/backstage/api/'
//
// 拦截器 存储token
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//
//   return config
// })

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
