import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import router from "@/router";
// create an axios instance
const request = axios.create({
  //baseURL:基地址，接口中共有地址配置到baseURL
  //请求接口时，会把api中配置的url和baseURL拼接到一起 去请求,除非你传过来的是一个绝对的URL地址
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  //超时，超过5s 默认这次请求 失败
  timeout: 5000,
});

//
// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    //1.取token
    const token=store.getters.token
    if(token){
      //有token的时候，再往请求头加
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    //状态码为2XX 就会执行第一个回调函数
    if(!response.data.success){
      //统一提示
      Message.error(response.data.message)
      return Promise.reject(new Error(response.data.message))
    }
    return response.data;
  },
  //状态码为4xx 会执行第二个回调函数
  function (error) {
    // 对响应错误做点什么
    //状态码为非2开头的进行统一提示
    console.log(error)
    if(error.response){
      if(error.response.status==401 && error.response.data.code==10002){
        //token过期
        store.commit('user/LOGOUT')
        router.push('/login')
      }
      Message.error(error.response.data.message||'服务器异常')
    }
    return Promise.reject(error);
  }
);
export default request;

// //请求拦截器
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent
//     //正常请求的时候，执行第一个函数
//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       //config.headers.X-Token
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     //请求失败的时候 会执行第二个函数
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// //响应拦截器
// service.interceptors.response.use(

//   response => {
//     const res = response.data
//     // 状态为2XX进行处理
//     //对失败的情况进行统一处理
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   //状态码 3XX-5XX 会执行第二个回调函数
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )
