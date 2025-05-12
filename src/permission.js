//全局前置守卫进行判断
import router from "./router";
import store from "./store";
import NProgress from "nprogress";
import { asyncRoutes } from "./router";
import "nprogress/nprogress.css";
import { mapGetters } from "vuex";

const whiteList = ["/login", "/404"];
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  //从store中获取token
  const token = store.getters.token;
  if (token) {
    //token有值
    if (to.path === "/login") {
      //有token访问的是登录页 跳转到首页
      next("/");
      NProgress.done();
    } else {
      //如果有用户信息，就不请求用户信息了
      const userInfo = store.state.user.userInfo;
      //空对象转blur值会一直为真
      if (Object.keys(userInfo).length === 0) {
        //获取用户数据
        const {
          roles: { menus },
        } = await store.dispatch("user/getUserInfo");
        //做权限判断使用
        // console.log(menus,'222');
        //1.赛筛选动态路由的位置,全局前置守卫
        const otherRoutes = asyncRoutes.filter((item) =>
          menus.includes(item.children[0].name)
        );
        //2、用户所对应的权限表示
        //3、所有动态路由
        //4、拿动态路由权限标识 进行筛选
        //5、拿到筛选后的动态路由添加到路由规则中
        //addRoutes在添加路由时 是一个异步过程
        //在执行next的时候一定要确保路由规则已经添加完成
        // console.log(otherRoutes);
        router.addRoutes([
          ...otherRoutes,
          { path: "*", redirect: "/404", hidden: true },
        ]);
        store.commit("routes/SETROUTES", [
          ...otherRoutes,
          { path: "*", redirect: "/404", hidden: true },
        ]);
        //下面这个方案可以等待addRoutes执行完成之后再跳转
        next({
          ...to,
          // path: to.path,
          // params: to.params,
          // meta: to.meta,
          replace: true, //表示替换上一次的历史记录
        });
        return;
      }
      //有token访问的是其他页，直接放行

      next();
    }
  } else {
    //token无值
    if (whiteList.includes(to.path)) {
      //访问的路径在白名单中，直接放行
      next();
    } else {
      //访问的路径不在白名单中，直接跳到登录页
      next("/login");
      NProgress.done();
    }
  }
});
//beforeEach中重定向之后 不会再走afterEach
router.afterEach((to, from) => {
  NProgress.done();
});
