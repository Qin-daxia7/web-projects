import Vue from "vue";
//作用：类似与reset.css 重置样式
import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import VueLazyload from 'vue-lazyload'

//导入element-ui 组件
import ElementUI from "element-ui";
//导入element-ui 对应的样式
import "element-ui/lib/theme-chalk/index.css";
//element-ui 的一个语言包 目的：做多语言切换


//导入style中的样式
import "@/styles/index.scss"; // global css
//导入跟组件
import App from "./App";
//导入vuex
import store from "./store";
//导入路由对象
import router from "./router";
import request from "@/utils/request";
//直接导入即可使用
// import { imgError } from "@/directive/index";
import * as directives from "@/directive/index";
import i18n from "@/lang/index";
//图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/common/img.jpeg'),
  loading: require('./assets/common/bigUserHeader.png'),
  attempt: 1
});
// 配置ElementUI的中英切换逻辑
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
});

// for(const key in directives){
//   // key是每个方法的名字

//   Vue.directive(key,directives[key])

// }
//注册全局组件
import Components from "./components";
Vue.use(Components);

//批量注册自定义指令
Object.keys(directives).forEach((key) => {
  if (key === "__esModule") return; // 忽略默认导出标识符
  Vue.directive(key, directives[key]);
});

//目标：this.$request 在vue原型对象上（原型对象上的属性和方法可以被实例所访问）
Vue.prototype.$request = request;

//要执行icons目录下的index.js
import "@/icons"; // icon
//要执行permissions这个文件
import "@/permission"; // permission control


//使用mock数据

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// 注册element-ui中的全局组件
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);

Vue.config.productionTip = false;

//获取环境变量值process.env.环境变量的名字
// console.log(process.env)

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: (h) => h(App),
});
