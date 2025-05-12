import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "test",
  SecretKey: "test",
});
export default cos;
