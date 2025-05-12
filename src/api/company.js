import request from "@/utils/request";

//查询企业
export const getCompanyApi = (id) => {
  return request({
    url: `/company/${id}`,
    method: "GET",
  });
};
