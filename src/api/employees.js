import request from "@/utils/request";

//获取用户数据
export const getUserListApi = (params) => {
  return request({
    url: "/sys/user",
    method: "GET",
    params,
  });
};

//删除员工
export const delEmployeeApi = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: "DELETE",
  });
};
//添加员工
export const addEmployeeApi = (data) => {
  return request({
    url: "/sys/user",
    method: "POST",
    data,
  });
};
//批量导入员工（excel）
export const addEmployeeByexcelApi = (list) => {
  return request({
    url: "/sys/user/batch",
    method: "POST",
    data: list,
  });
};

//获取员工详情信息
export const getUserDetailApi = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: "GET",
  });
};

//修改员工信息
export const updateUserInfoApi = (data) => {
  return request({
    url: `/sys/user/${data.id}`,
    method: "PUT",
    data,
  });
};
//给员工授予权限
export const assignRolesApi = (data) => {
  return request({
    url: "/sys/user/assignRoles",
    data,
    method: "put",
  });
};
