import request from "@/utils/request";
//获取组织架构列表
export const getCompanyDepartment = () => {
  return request({
    url: "/company/department",
  });
};

//删除部门
export const delDepartment = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: "DELETE",
  });
};

//获取部门负责人列表
export const getDepartmentManagerListApi = () => {
  return request({
    url: "/sys/user/simple",
    method: "GET",
  });
};

//添加部门
export const addDepartment = (params) => {
  return request({
    url: "/company/department",
    method: "POST",
    data: params,
  });
};

//获取部门详情
export const getDepartmentDetailApi = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: "GET",
  });
};

//修改部门
export const editDepartment = (data) => {
  return request({
    url: `/company/department/${data.id}`,
    method: "PUT",
    data,
  });
};
