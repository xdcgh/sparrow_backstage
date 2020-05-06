import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 全局样式
import './assets/css/global.css'

Vue.config.productionTip = false

// axios 配置
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080/api/backstage/'

// 对所有 axios 请求做处理
axios.defaults.withCredentials = true;

// 拦截器 存储token
axios.interceptors.request.use(config => {
  config.headers.cookie = window.sessionStorage.getItem('cookie')

  return config
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
