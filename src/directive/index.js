import Vue from "vue";
import store from "@/store";
//第一种写法
// //自定义指令
// Vue.directive("imgError", {
//   //使用该指令的Dom，插入到页面中会执行inserted
//   //el：使用该指令的元素
//   //binding：使用指令时传过来的数据(binding.value)
//   inserted(el, binding) {
//     el.onerror = () => {
//       el.src = binding.value;
//     };
//   },
// });

//第二种写法
export const imgError = {
  //使用该指令的Dom，插入到页面中会执行inserted
  //el：使用该指令的元素
  //binding：使用指令时传过来的数据(binding.value)
  inserted(el, binding) {
    el.onerror = () => {
      el.src = binding.value;
    };
  },
};
export const color = {};
export const permission = {
  inserted(el, binding) {
    //先获取用户对应的权限标识
    const roles = store.getters.roles;
    //获取按钮所对应标识
    if (!roles?.points.includes(binding.value)) {
      //1、通过css控制展示隐藏（不太好，可以桶设置css样式显示出来）
      // el.style.display = "none";
      //2、直接移除
      el.remove();
    }
  },
};
