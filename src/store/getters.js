
//$store.getters.sidebar
//$store.getters.['app/sidebar']
//全局getters目的：快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
 
}
export default getters
