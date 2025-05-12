<template>
  <div>
    <UploadExcel :on-success="handleSuccess"></UploadExcel>
  </div>
</template>

<script>
import { addEmployeeByexcelApi } from "@/api/employees";
export default {
  name: "",
  computed: {
    type() {
      return this.$route.query.type;
    },
  },
  methods: {
    //提交
    async handleSuccess({ results, header }) {
      if (this.type === "employee") {
        this.addEmployeeByExcel(results);
      }
    },

    //通过excel添加员工
    async addEmployeeByExcel(results) {
      // 定义字段映射关系，将中文字段名映射为英文字段名
      const userRelations = {
        入职日期: "timeOfEntry", // 入职日期 -> timeOfEntry
        手机号: "mobile", // 手机号 -> mobile
        姓名: "username", // 姓名 -> username
        转正日期: "correctionTime", // 转正日期 -> correctionTime
        工号: "workNumber", // 工号 -> workNumber
      };

      const list = []; // 存储转换后的员工数据

      // 遍历解析后的数据 results
      results.forEach((item) => {
        const newObj = {}; // 创建新的对象用于存储转换后的数据

        // 遍历每个 item（即一行数据）中的字段
        for (const key in item) {
          const engKey = userRelations[key]; // 获取对应的英文字段名
          let value = "";
          if (["timeOfEntry", "correctionTime"].includes(engKey)) {
            value = this.formatExcelDate(item[key]);
          } else {
            value = item[key];
          }
          // 获取字段值
          newObj[engKey] = value; // 将转换后的数据存入 newObj
        }

        list.push(newObj); // 将转换后的对象添加到 list 数组中
      });

      // console.log(list); // 控制台打印转换后的数据，方便调试

      // 调用 API 发送转换后的员工数据到后端进行批量添加
      await addEmployeeByexcelApi(list);

      // 显示成功提示信息
      this.$message({ message: "批量添加员工成功", type: "success" });

      // 返回上一页
      this.$router.go(-1);
    },
    //把excel中的时间戳转化乘正常日期
    //excel时间戳 是从1900年开始的
    /**
     * 转换excel的日期格式
     */
    formatExcelDate(numb, format) {
      const time = new Date(numb * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return (
          year +
          format +
          (month < 10 ? "0" + month : month) +
          format +
          (date < 10 ? "0" + date : date)
        );
      }
      return (
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style scoped></style>
