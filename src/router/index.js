import Vue from "vue";
import Router from "vue-router";

// 注册 VueRouter 插件，使 Vue 组件可以使用路由功能
Vue.use(Router);

/* Layout */
// 引入布局组件 Layout，作为部分页面的根组件
import Layout from "@/layout";
// 引入多个模块的规则
import approvalsRouter from "./modules/approvals";
import departmentsRouter from "./modules/departments";
import employeesRouter from "./modules/employees";
import permissionRouter from "./modules/permission";
import attendancesRouter from "./modules/attendances";
import salarysRouter from "./modules/salarys";
import settingRouter from "./modules/setting";
import socialRouter from "./modules/social";

// 动态路由表 => 动态路由(需要权限才可以访问的) 我们这里准备一个数组存放
export const asyncRoutes = [
  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter,
  approvalsRouter,
  attendancesRouter,
  salarysRouter,
  socialRouter,
];
/**
 * 路由元信息（meta）属性说明：
 *
 * hidden: true                  // 如果设置为 true，该路由不会显示在侧边栏（默认 false）
 * alwaysShow: true              // 如果设置为 true，根菜单始终显示（即使只有一个子路由）
 * redirect: noRedirect          // 如果设置为 noRedirect，面包屑导航不会跳转
 * name: 'router-name'           // 该路由的名称，必须设置（用于 <keep-alive> 缓存）
 * meta : {
 *   roles: ['admin','editor']   // 角色权限控制，只有指定角色的用户可访问该页面
 *   title: '页面标题'           // 在侧边栏和面包屑中显示的名称
 *   icon: 'svg-name'/'el-icon-x'// 侧边栏显示的图标
 *   breadcrumb: false           // 如果设置为 false，则该页面不会出现在面包屑导航中（默认 true）
 *   activeMenu: '/example/list' // 设定激活的菜单高亮路径
 * }
 */

/**
 * constantRoutes
 * 静态路由：无需权限控制，所有角色均可访问的基本页面
 */
export const constantRoutes = [
  {
    path: "/login", // 登录页面路径
    component: () => import("@/views/login/index"), // 动态导入登录组件
    hidden: true, // 不在侧边栏显示
  },

  {
    path: "/404", // 404 页面路径
    component: () => import("@/views/404"), // 动态导入 404 组件
    hidden: true, // 不在侧边栏显示
  },

  {
    path: "/", // 根路径
    component: Layout, // 采用 Layout 作为根组件
    redirect: "/dashboard", // 默认重定向到 /dashboard
    children: [
      {
        path: "dashboard", // 仪表盘页面路径
        name: "Dashboard", // 路由名称
        component: () => import("@/views/dashboard/index"), // 动态导入仪表盘组件
        meta: { title: "首页", icon: "dashboard" }, // 设置标题和图标
      },
    ],
  },
  {
    path: "/import", // 根路径
    component: Layout, // 采用 Layout 作为根组件
    children: [
      {
        path: "index", // 仪表盘页面路径
        name: "Dashboard", // 路由名称
        component: () => import("@/views/import/index.vue"), // 动态导入仪表盘组件
        hidden: true,
      },
    ],
  },

  // // 外部链接
  // {
  //   path: "external-link",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "https://panjiachen.github.io/vue-element-admin-site/#/", // 访问的外部 URL
  //       meta: { title: "External Link", icon: "link" }, // 设置标题和图标
  //     },
  //   ],
  // },

  // 404 页面必须放在最后，避免前面未匹配的路径直接进入 404 页面
  //如果使用addRoutes动态添加路由 path:*一定要配置到最后
  // { path: "*", redirect: "/404", hidden: true },
];

/**
 * 创建路由实例
 * @returns {Router} 返回 VueRouter 实例
 */
const createRouter = () =>
  new Router({
    mode: "history", // 开启 history 模式（需要服务器支持）
    scrollBehavior: () => ({ y: 0 }), // 滚动行为，每次路由切换时滚动到顶部
    //做权限的时候要去掉动态路由的合并
    routes: [...constantRoutes], // 配置静态路由
  });

// 通过方法创建路由对象，封装的目的在于可以在需要时重置路由
const router = createRouter();

/**
 * 重置路由规则
 * 主要用于用户注销后，清空动态添加的权限路由
 */
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // 替换原来的路由匹配规则
}

export default router;
