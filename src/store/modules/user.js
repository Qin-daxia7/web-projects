import { loginApi, getUserInfoApi, getUserStaffPhoto } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
const state = {
  token: getToken() || "",
  userInfo: {},
};

const mutations = {
  SETTOKEN(state, newToekn) {
    state.token = newToekn;
    setToken(newToekn);
  },
  SETUSERINFO(state, newValue) {
    state.userInfo = newValue;
  },
  LOGOUT(state) {
    state.token = "";
    state.userInfo = "";
    removeToken();
  },
};
//vuex中存数据 取数据（在vuex中 不适合写业务逻辑相关代码）
//   if(res.data.success){
//     router.push('/')
//   }else{
//     alert('用户名密码错误')
//   }
const actions = {
  async setToken({ commit }, data) {
    const res = await loginApi(data);

    // console.log(res, "user");
    commit("SETTOKEN", res.data);

    return res;
  },
  async getUserInfo({ commit }) {
    const res = await getUserInfoApi();
    const item = await getUserStaffPhoto(res.data.userId);

    const result = {
      ...res.data,
      ...item.data,
    };
    commit("SETUSERINFO", result);
    return res.data;
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
