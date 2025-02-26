// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // 加载进度条
//   NProgress.start()

//   // 设置页签的文本
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     //有token的逻辑
//     if (to.path === '/login') {
//       // next('/')简单写法
//       next({ path: '/' })//完整写法
//       NProgress.done()
//       //有token跳转的是非登录页
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         //有用户信息，直接放行
//         next()
//         //没有用户信息
//       } else {
//         //重新获取用户信息
//         try {
//           await store.dispatch('user/getInfo')
//           //token能获取到用户信息，说明信息有效，直接放行
//           next()
//         } catch (error) {
//           //获取不到用户信息，token失效，跳转到登录页
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//     //没有token的逻辑
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       //访问的是白名单，直接放行
//       next()
//     } else {
//       // 访问的不是白名单，跳转到登录页
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
