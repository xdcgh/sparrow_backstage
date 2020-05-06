import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/user/Login'
import Register from "../components/user/Register"
import Home from "../components/Home"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
