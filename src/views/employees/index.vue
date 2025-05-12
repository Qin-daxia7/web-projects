<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <!-- <template #left>
          <span>总记录数: 16 条</span>
        </template> -->

        <template #right>
          <el-button
            v-permission="'excel_import'"
            type="warning"
            size="small"
            @click="$router.push('/import/index?type=employee')"
            >excel导入</el-button
          >
          <el-button
            v-permission="'excel_export'"
            type="danger"
            size="small"
            @click="handleDownload"
            >excel导出</el-button
          >
          <el-button
            v-permission="'add'"
            type="primary"
            size="small"
            @click="openDialog"
            >新增员工</el-button
          >
        </template>
      </page-tools>

      <el-card style="margin-top: 10px">
        <el-table border :data="list" v-loading="loading">
          <el-table-column label="序号" type="index" :index="indexMethod" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column>
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="row.staffPhoto||require('@/assets/common/img.jpeg')"
                lazy
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterText"
          />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间">
            <template #default="{ row }">
              {{ formateTime(row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="280">
            <template #default="scope">
              <el-button
                v-permission="'look'"
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${scope.row.id}`)"
                >查看</el-button
              >
              <el-button
                v-permission="'sort'"
                type="text"
                size="small"
                @click="openRoleDialog(scope.row.id)"
                >分配角色</el-button
              >
              <el-button
                v-permission="'delete'"
                type="text"
                size="small"
                @click="delEmployee(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- layout 分页的样式（功能） -->
        <!-- current-page 当前的页面 -->
        <!-- :page-sizes 设置当前也页容量 -->
        <!--:page-size 当前页容量  -->
        <!-- total 全部数据 -->
        <!-- @size-change 改变页容量触发 -->
        <!-- @current-change 当前页码变化的时候触发 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
      <AddEmployee :showDialog.sync="showDialog" @refreshData="getUserList" />
      <AssignRole
        :showRoleDialog.sync="showRoleDialog"
        :userId="userId"
      ></AssignRole>
    </div>
  </div>
</template>

<script>
import { getUserListApi, delEmployeeApi } from "@/api/employees";
import AssignRole from "@/components/AssignRole/index.vue";
import AddEmployee from "./components/AddEmployee.vue";
import EnnumObj from "@/constant/employees";
import dayjs from "dayjs";
import mixins from "@/mixins/permission";
export default {
  name: "Employees",
  //混入
  mixins: [mixins],
  data() {
    return {
      list: [],
      page: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数
      loading: false,
      //弹窗显示
      showDialog: false,
      //分配角色弹窗显示
      showRoleDialog: false,
      //用户uid
      userId: "",
      loading: true,
    };
  },
  components: {
    AddEmployee,
    AssignRole,
  },
  created() {
    this.getUserList();
  },

  methods: {
    //获取员工列表
    async getUserList() {
      const { data } = await getUserListApi({
        page: this.page,
        size: this.pageSize,
      });
      this.list = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    //改变页面大小
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },
    //页面跳转
    handleCurrentChange(val) {
      this.page = val;
      this.getUserList();
    },
    //自定义序号
    indexMethod(row) {
      return row + 1 + this.pageSize * (this.page - 1);
    },
    //删除员工
    delEmployee(id) {
      this.$confirm("确定要删除该员工吗？", "温馨提示")
        .then(async () => {
          await delEmployeeApi(id);
          this.$message({ message: "删除成功", type: "success" });
          if (this.list.lenght == 1 && this.page > 1) {
            this.page--;
          }
          this.getUserList();
        })
        .catch(() => {});
      this.getUserList();
    },
    //打开弹窗
    openDialog() {
      this.showDialog = true;
    },
    //计算聘用形式
    formatterText(row, column, cellValue, index) {
      const formOfEmployment = +cellValue;
      // if (formOfEmployment == 1) {
      //   return "正式";
      // } else if (formOfEmployment == 2) {
      //   return "非正式";
      // }
      const hireType = EnnumObj.hireType;
      //filter find都可以进行筛选
      //filter 筛选结果 （空）数组
      //find 筛选出符合条件的第一个元素 或者underfind
      const result = hireType.find((item) => item.id === formOfEmployment);
      return result ? result.value : "未知";
    },
    //统一时间格式
    formateTime(time) {
      return time ? dayjs(time).format("YYYY-MM-DD") : "";
    },
    //导出excel文件
    async handleDownload() {
      const { data } = await getUserListApi({ page: 1, size: this.total });
      const headersArr = [
        "姓名",
        "手机号",
        "入职日期",
        "聘用形式",
        "转正日期",
        "工号",
        "部门",
      ];
      const headersRelations = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      const result = this.transListObjToDoubleList(
        data.rows,
        headersArr,
        headersRelations
      );

      import("@/vendor/Export2Excel").then((excel) => {
        excel.export_json_to_excel({
          //表头
          header: headersArr,
          //data是要导出的数据，并且是一个二维数组
          data: result,
          //文件名
          filename: "员工信息",
          //宽度自适应
          autoWidth: true,
          //文件后缀名
          bookType: "xlsx",
        });
      });
    },
    //将数组对象转化为二维数组
    transListObjToDoubleList(rows, headersArr, headersRelations) {
      // 使用 map 遍历 rows 数组，rows 是包含数据对象的数组
      const result = rows.map((item) => {
        // 对每一行数据对象（item）进行处理
        return headersArr.map((header) => {
          // 对 headersArr 中的每个表头字段进行映射
          // headersRelations[header] 获取表头字段对应的字段名（如 '姓名' -> 'username'）
          // 然后通过 item[headersRelations[header]] 获取该字段在 item 对象中的值
          let value = item[headersRelations[header]];
          //处理聘用时间
          if (header === "聘用形式") {
            if (value == 1 || value == 2) {
              return value == "1" ? "正式" : "非正式";
            } else return "未知";
          }
          //处理入职时间和转正时间
          if (
            ["timeOfEntry", "correctionTime"].includes(headersRelations[header])
          ) {
            return value ? dayjs(value).format("YYYY-MM-DD") : "";
          }
          return value;
        });
      });

      // 返回二维数组，格式是每一行对应 headersArr 中字段的顺序
      return result;
    },
    //打开分配角色弹窗
    openRoleDialog(id) {
      this.userId = id;
      this.showRoleDialog = true;
    },
  },
};
</script>

<style></style>
