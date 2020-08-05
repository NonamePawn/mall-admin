import Vue from 'vue'
import VueRouter from 'vue-router'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/home/Welcome')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/home/Home')
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/login/Login')

// import Login from '../views/login/Login'
// import Home from "../views/home/Home";
// import Welcome from "../views/home/Welcome";

const Users = () => import(/* webpackChunkName: "user_roles_rights" */ '../views/home/user/Users')
const Roles = () => import(/* webpackChunkName: "user_roles_rights" */ '../views/home/roles/Roles')
const Rights = () => import(/* webpackChunkName: "user_roles_rights" */ '../views/home/roles/Rights')

// import Users from "../views/home/user/Users";
// import Roles from "../views/home/roles/Roles";
// import Rights from "../views/home/roles/Rights";

const Cate = () => import(/* webpackChunkName: "cate_params" */ '../views/home/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../views/home/goods/Params')

// import Cate from "../views/home/goods/Cate";
// import Params from "../views/home/goods/Params";

const List = () => import(/* webpackChunkName: "list_add" */ '../views/home/goods/List')
const Add = () => import(/* webpackChunkName: "list_add" */ '../views/home/goods/Add')

// import List from "../views/home/goods/List";
// import Add from "../views/home/goods/Add";

const Order = () => import(/* webpackChunkName: "order_report" */ '../views/home/order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */ '../views/home/report/Report')

// import Order from "../views/home/order/Order";
// import Report from "../views/home/report/Report";


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
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/roles', component: Roles},
      {path: '/rights', component: Rights},
      {path: '/categories', component: Cate},
      {path: '/params', component: Params},
      {path: '/goods', component: List},
      {path: '/goods/add', component: Add},
      {path: '/orders', component: Order},
      {path: '/reports', component: Report},
      ]
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
