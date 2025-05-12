import request from "@/utils/request";
//获取权限列表
export const getPermissionsListApi = () => {
  return request({
    url: "/sys/permission",
    method: "GET",
  });
};
//添加权限点
export const addPermissionApi = (data) => {
  return request({
    url: "/sys/permission",
    method: "POST",
    data,
  });
};
//删除权限点
export const delPermissionApi = (id) => {
  return request({
    url: `/sys/permission/${id}`,
    method: "DELETE",
  });
};
//获取权限详情
export const getPermissionsDetailApi = (id) => {
  return request({
    url: `/sys/permission/${id}`,
    method: "GET",
  });
};
//修改权限点
export const editPermissionApi = (data) => {
  return request({
    url: `/sys/permission/${data.id}`,
    method: "PUT",
    data,
  });
};
