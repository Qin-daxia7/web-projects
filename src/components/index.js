// 该文件负责所有的公共组件的全局注册
// vue插件机制: Vue.use
import PageTools from "./PageTools";
import UploadExcel from "./UploadExcel";
import ImageUpload from "./ImageUpload";
import Screenfull from "./ScreenFull";
import Lang from "./Lang";
import AiDialog from "@/components/AiDialog/index.vue";
export default {
  install(Vue) {
    Vue.component("PageTools", PageTools);
    Vue.component("UploadExcel", UploadExcel);
    Vue.component("ImageUpload", ImageUpload);
    Vue.component("Screenfull", Screenfull);
    Vue.component("Lang", Lang);
    Vue.component("AiDialog",AiDialog)
  },
};
