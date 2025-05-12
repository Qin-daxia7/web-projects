import { constantRoutes } from "@/router";
const state = {
  routes: [],
};

const mutations = {
  //otherRoutes筛选后的动态路由
  SETROUTES(data, otherRoutes) {
    state.routes = [...constantRoutes, ...otherRoutes];
  },
  //退出登录
  RESETROUTES(data, restRoutes) {
    state.routes = restRoutes;
  },
};

const actions = {};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
