<template>
  <div>
    <el-dialog
      :visible="showDialog"
      @close="closeDialog"
      @click.native="hideTreeDialog"
    >
      <el-form ref="formRef" :rules="rules" label-width="120px" :model="form">
        <el-form-item label="姓名" prop="username">
          <el-input
            placeholder="请输入姓名"
            style="width: 50%"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            placeholder="请输入手机号码"
            style="width: 50%"
            v-model="form.mobile"
          ></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            type="date"
            placeholder="请选择入职日期"
            style="width: 50%"
            v-model="form.timeOfEntry"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入职形式">
          <el-select
            placeholder="请选择入职形式"
            style="width: 50%"
            v-model="form.formOfEmployment"
          >
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            placeholder="请输入工号"
            style="width: 50%"
            v-model="form.workNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <!-- .stop阻止时间冒泡 -->
          <el-input
            placeholder="请输入部门"
            style="width: 50%"
            v-model="form.departmentName"
            @click.native.stop="getDepartmentList"
            :readonly="true"
          ></el-input>
          <div v-show="showTree" class="tree-box">
            <el-tree
              :data="depts"
              :props="defaultProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            type="date"
            placeholder="请选择转正时间"
            style="width: 50%"
            v-model="form.correctionTime"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <template v-slot:footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addEmployeeApi } from "@/api/employees";
import { getCompanyDepartment } from "@/api/departments";
import { makeTreeData } from "@/utils";
import EnumObj from "@/constant/employees";
export default {
  data() {
    return {
      //表单数据
      form: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      //部门
      depts: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      //控制el-tree的显示与隐藏
      showTree: false,
      hireType: EnumObj.hireType,
      rules: {
        username: [
          {
            required: true,
            message: "名字不能为空",
            trigger: ["blur", "change"],
          },
          {
            min: 2,
            max: 5,
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          {
            required: true,
            message: "手机号码不能为空",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号码格式不正确请从新输入",
            trigger: ["blur", "change"],
          },
        ],
        formOfEmployment: [
          {
            required: true,
            message: "聘用形式不能为空",
            trigger: ["blur", "change"],
          },
        ],
        workNumber: [
          {
            required: true,
            message: "聘用形式不能为空",
            trigger: ["blur", "change"],
          },
        ],
        timeOfEntry: [
          {
            required: true,
            message: "聘用形式不能为空",
            trigger: ["blur", "change"],
          },
        ],
        correctionTime: [
          {
            required: true,
            message: "聘用形式不能为空",
            trigger: ["blur", "change"],
          },
        ],
        departmentName: [
          {
            required: true,
            message: "部门不能为空",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  name: "",
  props: {
    showDialog: {
      type: Boolean,
      //如果父组件不传递参数默认false
      default: false,
    },
  },
  methods: {
    //关闭弹窗
    closeDialog() {
      this.$emit("update:showDialog", false);
      this.showTree = false;
    },
    //获取部门详情
    async getDepartmentList() {
      this.isLoading = true;
      this.showTree = !this.showTree;
      if (this.showTree === true) {
        const res = await getCompanyDepartment();
        this.depts = makeTreeData(res.data.depts, "");
      }
      this.isLoading = false;
    },
    //添加员工
    confirmAdd() {
      this.$refs.formRef.validate(async (flag) => {
        //验证不通过直接返回
        if (!flag) return;
        else {
          await addEmployeeApi(this.form);
          this.$message({ message: "员工添加成功", type: "success" });
          //清空表单数据
          (this.form = {
            username: "",
            mobile: "",
            formOfEmployment: "",
            workNumber: "",
            departmentName: "",
            timeOfEntry: "",
            correctionTime: "",
          }),
            // 重置表单校验状态
            this.$nextTick(() => {
              this.$refs.formRef && this.$refs.formRef.resetFields();
            });
          //关闭弹窗
          this.closeDialog();
          // // 触发事件通知父组件更新数据
          // this.$emit("refreshData");
          this.$parent.getUserList();
        }
      });
      //this.$parent 获取上级组件 来调用上级组件中的方法和属性
      // console.log(this.$parent);
    },
    //点击外围关闭el-tree
    hideTreeDialog() {
      this.showTree = false;
    },
    //选择部门
    handleNodeClick(data) {
      //有子部门只能展开，不能选择
      if (data.children.length > 0) return;
      this.form.departmentName = data.name;
      this.showTree = false;
      // console.log(data);
    },
  },
};
</script>

<style scoped lang="scss">
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: hidden;
  background-color: #fff;
  max-height: 200px;
  overflow: auto;
  ::v-deep {
    .el-tree-node__content {
      height: auto;
    }
  }
}
</style>
