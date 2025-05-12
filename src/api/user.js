import request from "@/utils/request";

/**
 *
 * @param {*} loginForm 登录接口
 * @returns
 */
export const loginApi = (loginForm) => {
  return request({
    url: "/sys/login",
    method: "POST",
    data: loginForm,
  });
};
//获取用户资料
export const getUserInfoApi = () => {
  return request({
    url: "/sys/profile",
    method: "POST",
  });
};
//获取用户头信息（含头像）
export const getUserStaffPhoto = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: "GET",
  });
};

//查询用户工资
export const getUserSalaryApi=(id)=>{
  return request({
    url:` /salarys/modify/${id}`
  })
}
