import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login'
import Home from "../views/home/Home";

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
    path: '/home',
    component: Home
  }

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

//挂载导航守卫
router.beforeEach((to , from, next) => {
  //访问登录页直接放行
  if (to.path === '/login') return next()
  //访问其它页面
  //获取token
  const token = window.sessionStorage.getItem('token')
  //如果没有token,去登录页面
  if (!token) return next('/login')
  //如果有token,放行
  next()
})

export default router
