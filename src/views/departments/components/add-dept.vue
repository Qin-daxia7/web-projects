<template>
  <!-- 新增部门的弹层 -->
  <!-- @open="getDepartmentManagerList" -->
  <el-dialog
    :title="title"
    :visible="showDialog"
    @close="handleCloseDialog"
    :close-on-click-modal="false"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <!-- 校验规则 -->
    <!-- 1.el-form :model :rules -->
    <!-- 2.el-form-item prop -->
    <!-- 3.el-imput v-model -->
    <el-form label-width="120px" :model="form" :rules="rules" ref="form">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="form.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          style="width: 80%"
          placeholder="请选择"
          v-model="form.manager"
        >
          <el-option
            v-for="item in managerList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          >
          </el-option
        ></el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="form.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <template #footer>
      <div>
        <el-button type="primary" size="small" @click="confirmAdd"
          >确定</el-button
        >
        <el-button size="small" @click="handleCloseDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  getDepartmentManagerListApi,
  addDepartment,
  getDepartmentDetailApi,
  editDepartment,
} from "@/api/departments";
import { title } from "@/settings";
export default {
  data() {
    return {
      // title:'',
      form: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          {
            required: true,
            message: "部门名称不可为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "部门名称长度为1-50",
            trigger: "blur",
          },
          { validator: this.validateDeptName, trigger: "blur" },
        ],
        code: [
          {
            required: true,
            message: "部门编码不可为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "部门编码长度为1-50",
            trigger: "blur",
          },
          { validator: this.validateDeptCode, trigger: "blur" },
        ],
        manager: [
          {
            required: true,
            message: "部门负责人不可为空",
            trigger: "change",
          },
        ],
        introduce: [
          {
            required: true,
            message: "部门介绍不可为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 300,
            message: "部门介绍长度为1-300",
            trigger: "blur",
          },
        ],
      },
      originForm: {},
      managerList: [],
    };
  },
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    nodeData: {
      type: Object,
      // default:function(){
      //   return{}
      // },
      default: () => ({}),
    },
    departsList: {
      type: Array,
      default: () => {},
    },
  },
  computed: {
    title() {
      if (this.form.id) {
        return "修改部门";
      } else {
        return "添加部门";
      }
    },
  },
  created() {
    //在created中调用，弹窗还没有打开就调用了这个接口（visible的原因display:none|block）
    // this.getDepartmentManagerList()
  },
  methods: {
    //关闭弹窗
    handleCloseDialog() {
      // 子传父
      // this.$emit("close-dialog");
      this.$emit("update:showDialog", false);
      //清空表单数据

      this.form = {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      };
      //resetFields只能清空绑定了prop的表单域中的数据和校验，无法清空data中的数据
      this.$refs.form.resetFields();
    },
    //rule用不到
    //value文本框中输入内容
    //callback不管成功还是失败都要执行：callback() callback(错误提示)
    validateDeptName(rule, value, callback) {
      //value可以拿到输入框中输入的内容
      //还应该拿到我们点击这一行 对应的子级
      //nodeData拿到这一行进行比较
      if (this.form.id) {
        if ((value === this.originForm.name)) {
          //判断与原来输入的值是否相同，相同也可以执行
          callback();
          return;
        } else {
          //修改
          //你输入的内容，不能与你兄弟的内容重复
          const arr = this.departsList.filter(
            (item) => item.pid === this.form.pid
          );
          const flag = arr.some((item) => item.name == value);
          flag ? callback("部门名称不能重复") : callback();
        }
      } else {
        //添加
        const children = this.nodeData.children;
        //只要有一个部门中的name和value一样就校验不通过
        const flag = children.some((item) => item.name === value);
        flag ? callback("部门名称不能重复") : callback();
        // console.log(value);
      }
    },
    //校验部门编码
    validateDeptCode(rule, value, callback) {
      // if (this.form.id) {
      //   //修改状态
      //   //你输入的值 value
      //   //原来的值
      //   if (value === this.originForm.code) {
      //     code();
      //     return;
      //   } else {
      //     const flag = this.departsList.some((item) => item.code === value);
      //     flag ? callback("部门编码不能重复") : callback();
      //   }
      // } else {
      //   //value可以拿到输入框中输入的内容
      //   //departsList列表中的所有数据
      //   const flag = this.departsList.some((item) => item.code === value);
      //   flag ? callback("部门编码不能重复") : callback();
      // }
      //简写
      if (this.form.id) {
        //修改状态
        //你输入的值 value
        //原来的值
        if (value === this.originForm.code) {
          callback();
          return;
        }
        const flag = this.departsList.some((item) => item.code === value);
        flag ? callback("部门编码不能重复") : callback();
      }
    },
    //获取部门负责人列表
    async getDepartmentManagerList() {
      const res = await getDepartmentManagerListApi();
      this.managerList = res.data;
    },
    //确定添加、修改部门
    confirmAdd() {
      this.$refs.form.validate(async (flag) => {
        if (!flag) return;
        if (this.form.id) {
          //修改状态
          await editDepartment(this.form);
          this.$message.success("修改成功");
        } else {
          //添加状态
          this.form.pid = this.nodeData.id;
          await addDepartment(this.form);
          this.$message.success("添加成功");
        }
        //关闭弹窗
        this.handleCloseDialog();
        this.$emit("addSuccess");
      });
    },
    //获取部门详情
    async getDepartmentDetail(id) {
      const res = await getDepartmentDetailApi(id);
      this.form = res.data;
      this.originForm = { ...res.data };
    },
  },
};
</script>
