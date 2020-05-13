import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/user/Login'
import Register from "../components/user/Register"

import Home from "../components/Home"

import AddFresh from "../components/fresh/AddFresh"
import EditFresh from "../components/fresh/EditFresh"
import Order from "../components/order/Order"
import ShopInfo from "../components/shop/ShopInfo"

import ShopApplyList from "../components/shop/ShopApplyList"
import ShopList from "../components/shop/ShopList"
import UserList from "../components/user/UserList"

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
    component: Home,
    redirect: '/order',
    children: [
      {
        path: '/addFresh',
        component: AddFresh
      },
      {
        path: '/editFresh',
        component: EditFresh
      },
      {
        path: '/order',
        component: Order
      },
      {
        path: '/shopInfo',
        component: ShopInfo
      },
      {
        path: '/shopApplyList',
        component: ShopApplyList
      },
      {
        path: '/shopList',
        component: ShopList
      },
      {
        path: '/userList',
        component: UserList
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    return next()
  }

  if (!window.sessionStorage.getItem('cookie')) {
    return next('/login')
  }

  next()
})

export default router
