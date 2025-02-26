import Vue from 'vue'
//作用：类似与reset.css 重置样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

//导入element-ui 组件
import ElementUI from 'element-ui'
//导入element-ui 对应的样式
import 'element-ui/lib/theme-chalk/index.css'
//element-ui 的一个语言包 目的：做多语言切换
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

//导入style中的样式
import '@/styles/index.scss' // global css
//导入跟组件
import App from './App'
//导入vuex
import store from './store'
//导入路由对象
import router from './router'

//要执行icons目录下的index.js
import '@/icons' // icon
//要执行permissions这个文件
import '@/permission' // permission control

//使用mock数据

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// 注册element-ui中的全局组件
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

//获取环境变量值process.env.环境变量的名字
console.log(process.env)


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
