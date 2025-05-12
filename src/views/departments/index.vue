<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="tree-card" v-loading="isLoading">
        <!-- 用了一个行列布局 -->
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="height: 40px"
        >
          <el-col :span="20">
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex">
              <!-- 两个内容 -->
              <el-col :span="12">负责人</el-col>
              <el-col :span="12">
                <!-- 下拉菜单 element -->
                <el-dropdown @command="handleCommand">
                  <span> 操作<i class="el-icon-arrow-down" /> </span>
                  <!-- 下拉菜单 -->
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      command="add"
                      @click.native="addGradeOnedept"
                      >添加子部门</el-dropdown-item
                    >
                    <el-dropdown-item command="edit"
                      >修改子部门</el-dropdown-item
                    >
                    <!--@click.native 绑定事件1  -->
                    <!-- <el-dropdown-item @click.native="del">删除子部门</el-dropdown-item> -->
                    <el-dropdown-item command="del"
                      >删除子部门</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <template #default="{ data }">
            <el-row
              type="flex"
              justify="space-between"
              align="middle"
              style="height: 40px; width: 100%"
            >
              <el-col :span="20">
                <span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex">
                  <!-- 两个内容 -->
                  <el-col :span="12">{{ data.manager }}</el-col>
                  <el-col :span="12">
                    <!-- 下拉菜单 element -->
                    <el-dropdown @command="handleCommand">
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <!-- 下拉菜单 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="{ type: 'add', data: data }"
                          >添加子部门</el-dropdown-item
                        >
                        <el-dropdown-item
                          :command="{ type: 'edit', id: data.id }"
                          >修改子部门</el-dropdown-item
                        >
                        <!--@click.native 绑定事件1  -->
                        <!-- <el-dropdown-item @click.native="del">删除子部门</el-dropdown-item> -->
                        <el-dropdown-item
                          :command="{ type: 'del', id: data.id }"
                          >删除子部门</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 弹窗组件 -->
    <!-- :show-dialog.sync="showDialog" 对showDialog进行放权，让其子组件可以对数据进行修改 -->
    <add-dept
      @addSuccess="getDepartmentList"
      :show-dialog.sync="showDialog"
      :nodeData="nodeData"
      :departsList="departsList"
      ref="addDept"
    />
  </div>
</template>

<script>
import AddDept from "./components/add-dept"; // 引入新增部门组件
import { getCompanyDepartment, delDepartment } from "@/api/departments";
import { makeTreeData } from "@/utils";
export default {
  name: "Departments",
  components: {
    AddDept,
  },
  data() {
    return {
      company: {
        name: "",
      },
      isLoading: false,
      //部门数据
      departs: [],
      defaultProps: {
        label: "name",
        children: "children",
      },
      //弹窗控制
      showDialog: false,
      //当前点击这一行的数据
      nodeData: {},
      //放置组织架构处理之前全部数据
      departsList: [],
    };
  },
  created() {
    this.getDepartmentList();
  },

  methods: {
    //获取组织架构列表
    async getDepartmentList() {
      this.isLoading = true;
      const res = await getCompanyDepartment();
      this.departsList = res.data.depts;
      this.departs = makeTreeData(res.data.depts, "");
      // console.log(this.departs);
      this.company.name = res.data.companyName;
      this.company.children = this.departs;
      this.isLoading = false;
    },

    //处理部门
    handleCommand({ type, id, data }) {
      if (type === "add") {
        this.openDialog(data);
      } else if (type === "edit") {
        this.editDepartment(id);
      } else if (type === "del") {
        this.delDepartment(id);
      }
    },
    //删除部门
    delDepartment(id) {
      // console.log(id)
      this.$confirm("确定要删除此数据吗？", "温馨提示")
        .then(async () => {
          //点击了确定
          await delDepartment(id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getDepartmentList();
        })
        .catch(() => {
          //点击了取消
        });
    },
    //添加部门
    openDialog(data) {
      this.showDialog = true;
      this.nodeData = data;
      //调用子组件中的方法
      // this.$refs.form.validate
      //获取部门负责人列表

      this.$refs.addDept.getDepartmentManagerList();
      // this.$refs.addDept.title = "新增部门";
    },
    // //关闭弹窗
    // closeDialog() {
    //   this.showDialog = false;
    // },
    //点击添加一级部门
    addGradeOnedept() {
      this.showDialog = true;
      //为一级部门设置一个空id
      this.company.id = "";
      this.nodeData = this.company;
      //获取部门负责人列表
      this.$refs.addDept.getDepartmentManagerList();
    },
    //编辑部门
    editDepartment(id) {
      this.showDialog = true;
      //方法1.直接调用子组件的数据
      // this.$refs.addDept.title = "修改部门";
      this.$refs.addDept.getDepartmentManagerList();
      this.$refs.addDept.getDepartmentDetail(id);
    },
  },
};
</script>

<style scoped lang="scss">
.tree-card {
  padding: 30px 30px;
  font-size: 14px;
}
.el-tree {
  ::v-deep {
    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    // 有子节点 且未展开 +
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 有子节点 且已展开 -
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>
