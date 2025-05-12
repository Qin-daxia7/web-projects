// 引入华为云 OBS SDK
import OBS from "esdk-obs-browserjs";

const obs = new OBS({
  // 推荐通过环境变量获取AKSK，这里也可以使用其他外部引入方式传入，如果使用硬编码可能会存在泄露风险
  // 您可以登录访问管理控制台获取访问密钥AK/SK，获取方式请参见https://support.huaweicloud.com/usermanual-ca/ca_01_0003.html
  access_key_id: process.env.ACCESS_KEY_ID,
  secret_access_key: process.env.SECRET_ACCESS_KEY,
  // 【可选】如果使用临时AK/SK和SecurityToken访问OBS，同样建议您尽量避免使用硬编码，以降低信息泄露风险。您可以通过环境变量获取访问密钥AK/SK，也可以使用其他外部引入方式传入
  // security_token: process.env.SECURITY_TOKEN,
  // endpoint填写Bucket对应的Endpoint, 这里以华北-北京四为例，其他地区请按实际情况填写
  server: "https://hrsass-3-19.obs.cn-south-1.myhuaweicloud.com",
});

export default obs;
