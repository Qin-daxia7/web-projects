import request from "@/utils/request";

//获取员工列表
export const getRoleListApi = (params) => {
  return request({
    url: "/sys/role",
    method: "GET",
    params,
  });
};

//删除员工
export const delRoleApi = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: "DELETE",
  });
};

//添加员工
export const addRoleApi = (data) => {
  return request({
    url: "/sys/role",
    method: "POST",
    data,
  });
};

//获取角色详情
export const getRoleDetailApi = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: "GET",
  });
};

//修改角色属性
export const editRoleApi = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: "PUT",
    data,
  });
};

//获取权限列表
export const getRoleAssignApi = () => {
  return request({
    url: "/sys/permission",
    method: "GET",
  });
};
//给角色分配权限
export const giveAssignToRoleApi = (data) => {
  return request({
    url: "/sys/role/assignPrem",
    method: "PUT",
    data,
  });
};
