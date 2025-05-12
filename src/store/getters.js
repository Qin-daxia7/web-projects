//$store.getters.sidebar
//$store.getters.['app/sidebar']
//全局getters目的：快捷访问
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,

  //封装token进行快捷访问
  //store.getters.token
  token: (state) => state.user.token,
  name: (state) => state.user.userInfo.username,
  staffPhoto: (state) => state.user.userInfo.staffPhoto,
  routes: (state) => state.routes.routes,
  roles: (state) => state.user.userInfo?.roles || { points: [] },
  id: (statae) => statae.user.userInfo.id,
};
export default getters;
