import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'
//导入文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//注册文本编辑器
Vue.use(VueQuillEditor, /* { default global options } */)
//配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//配置请求拦截器
axios.interceptors.request.use(configs => {
  NProgress.start()
  configs.headers.Authorization = window.sessionStorage.getItem('token')
  return configs
})
axios.interceptors.response.use(configs => {
  NProgress.done()
  return configs
})

//将axios挂载到Vue原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dataFormat', function (originValue) {
  const dt = new Date(originValue)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
