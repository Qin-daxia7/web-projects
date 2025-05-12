<template>
  <div class="employees-container">
    <div class="app-container">
      <template>
        <div class="setting-container">
          <div class="app-container">
            <el-card>
              <el-tabs v-loading="isLoading">
                <!-- 左侧 -->
                <el-tab-pane label="角色管理">
                  <!-- 按钮 -->
                  <el-button
                    icon="el-icon-plus"
                    size="small"
                    type="primary"
                    @click="openDialog"
                    >新增角色</el-button
                  >
                  <!-- 表格 -->
                  <el-table :data="list">
                    <el-table-column
                      label="序号"
                      width="100"
                      type="index"
                      :index="indexMethod"
                    />
                    <el-table-column label="角色名称" width="240" prop="name" />
                    <el-table-column label="描述" prop="description" />
                    <el-table-column label="操作">
                      <template #default="{ row }">
                        <el-button
                          size="small"
                          type="success"
                          @click="openAssignDialog(row.id)"
                          >分配权限</el-button
                        >
                        <el-button
                          size="small"
                          type="primary"
                          @click="editRole(row.id)"
                          >编辑</el-button
                        >
                        <el-button
                          size="small"
                          type="danger"
                          @click="delRole(row.id)"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
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
                </el-tab-pane>

                <el-tab-pane label="公司信息">
                  <!-- 警告信息 -->
                  <el-alert
                    title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                    type="info"
                    show-icon
                    :closable="false"
                  />
                  <!-- 表单 -->
                  <el-form label-width="120px" style="margin-top: 50px">
                    <el-form-item label="公司名称">
                      <el-input
                        v-model="companyForm.name"
                        disabled
                        style="width: 400px"
                      />
                    </el-form-item>
                    <el-form-item label="公司地址">
                      <el-input
                        v-model="companyForm.companyAddress"
                        disabled
                        style="width: 400px"
                      />
                    </el-form-item>
                    <el-form-item label="邮箱">
                      <el-input
                        v-model="companyForm.mailbox"
                        disabled
                        style="width: 400px"
                      />
                    </el-form-item>
                    <el-form-item label="备注">
                      <el-input
                        v-model="companyForm.remarks"
                        type="textarea"
                        :rows="3"
                        disabled
                        style="width: 400px"
                      />
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-card>
            <el-dialog
              :visible="showDialog"
              @close="closeDialog"
              :close-on-click-modal="false"
              :title="title"
            >
              <el-form
                ref="roleForm"
                :model="form"
                :rules="rules"
                label-width="100px"
              >
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                  <el-input
                    v-model="form.description"
                    placeholder="请输入角色描述"
                  />
                </el-form-item>
              </el-form>
              <template #footer>
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="confirmAdd">确认</el-button>
              </template>
            </el-dialog>
          </div>
        </div>
      </template>
    </div>

    <!-- 权限分配弹窗 -->
    <el-dialog
      title="为角色分配权限"
      :visible="showAssignDialog"
      @close="closeAssignDialog"
    >
      <!-- 
        el-tree 组件是一个树形结构，用于展示和操作权限数据。
        下面的属性配置：
        - node-key: 用于标识每个节点的唯一 ID。
        - :data: 绑定树的数据源，这里是权限数据（permissionData）。
        - :props: 配置树的数据映射，定义如何在树中找到每个节点的 label 和 children。
        - v-loading: 控制树加载状态，加载时显示动画。
        - :show-checkbox: 是否显示复选框，允许用户选择多个节点。
        - :default-checked-keys: 设置树加载时默认勾选的权限项（权限 ID）。
        - @node-click: 节点点击事件触发函数。
      -->
      <el-tree
        ref="tree"
        :check-strictly="true"
        node-key="id"
        :data="permissionData"
        :props="defaultProps"
        v-loading="treeLoading"
        :show-checkbox="true"
        :default-checked-keys="defaultAssign"
        @node-click="handleNodeClick"
      ></el-tree>
      <template>
        <div>
          <el-button size="small" @click="closeAssignDialog">取消</el-button>
          <el-button size="small" type="primary" @click="confirmAddAssign"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleListApi,
  delRoleApi,
  addRoleApi,
  getRoleDetailApi,
  editRoleApi,
  getRoleAssignApi,
  giveAssignToRoleApi,
} from "@/api/settings";
import { getPermissionsListApi } from "@/api/permission";
import { getCompanyApi } from "@/api/company";
import { mapState } from "vuex";
import { makeTreeData } from "@/utils";
export default {
  name: "Settings",
  data() {
    return {
      //分配form权限
      permIds: [],
      //分配权限弹窗
      showAssignDialog: false,
      //角色id
      roleId: "",
      //权限列表
      permissionData: [],
      //权限树加载加载
      treeLoading: false,
      //默认权限勾选
      defaultAssign: [],
      page: 1,
      pageSize: 10,
      activeName: "second",
      list: [],
      // 数据总数
      total: 0,
      isLoading: false,
      //弹窗控制变量
      showDialog: false,
      //表单数据
      form: {
        name: "",
        description: "",
      },
      //公司信息
      companyForm: {
        name: "",
        companyAddress: "",
        mailbox: "",
        remarks: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "角色介绍不能为空", trigger: "blur" },
        ],
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  created() {
    this.getEmployeesList();
    this.getCompanyInfo();
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    async getEmployeesList() {
      //加载动画
      this.isLoading = true;
      const res = await getRoleListApi({
        page: this.page,
        pagesize: this.pageSize,
      });
      // console.log(res.data.rows);
      this.list = res.data.rows;
      this.total = res.data.total;
      // 加载动画结束
      this.isLoading = false;
    },
    //页面大小
    handleSizeChange(val) {
      //
      this.pageSize = val;
      // 切换切换页容量的时候 需要回将页面重置为1
      this.page = 1;
      this.getEmployeesList();
    },
    //页面跳转
    handleCurrentChange(val) {
      this.page = val;
      this.getEmployeesList();
    },
    //自定义索引
    indexMethod(row) {
      //当前页减一乘上当前页大小加上当前行加一
      return row + 1 + this.pageSize * (this.page - 1);
    },
    //删除role
    delRole(id) {
      this.$confirm("您确认要删除吗？", "温馨提示")
        .then(async () => {
          await delRoleApi(id);
          this.$message({ message: "删除成功", type: "success" });
          if (this.list.length === 1 && this.page > 1) {
            this.page--;
          }
          this.getEmployeesList();
        })
        .catch(() => {});
    },
    //打开弹窗
    openDialog() {
      this.showDialog = true;
    },
    //控制弹窗
    closeDialog() {
      this.showDialog = false;
      //清空表单
      this.form = {
        name: "",
        description: "",
      };
    },
    //确定添加或者编辑
    confirmAdd() {
      this.$refs.roleForm.validate(async (flag) => {
        if (!flag) {
          return;
        }
        if (this.form.id) {
          //id存在表示编辑
          await editRoleApi(this.form);
        } else {
          //id不存在表示添加
          await addRoleApi(this.form);
          this.$message({
            message: "修改成功！",
            type: "success",
          });
          this.$message({
            message: "添加成功！",
            type: "success",
          });
        }
        //刷新列表
        this.getEmployeesList();
        // 关闭弹窗
        this.closeDialog();
      });
    },
    //编辑角色
    async editRole(id) {
      this.showDialog = true;
      const res = await getRoleDetailApi(id);
      // console.log(res, "@@@");
      this.form = res.data;
    },
    //获取公司信息
    async getCompanyInfo() {
      const { data } = await getCompanyApi(this.userInfo.companyId);
      // console.log(this.$store.state.user.userInfo);
      this.companyForm = data;
    },
    //为角色分配权限的弹窗显示
    openAssignDialog(id) {
      this.roleId = id;
      //获取权限数据
      this.getRoleAssign();
      this.showAssignDialog = true;
    },
    //关闭弹窗
    closeAssignDialog() {
      this.showAssignDialog = false;
      this.permIds = []; // 清空权限 ID 列表
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]); // 强制清空树组件的勾选状态
      }
    },
    //获取权限列表
    async getRoleAssign() {
      const { data: Data } = await getPermissionsListApi();
      //制作成树型数据
      this.permissionData = makeTreeData(Data, "0");
      this.treeLoading = true;
      //获取默认权限
      const { data: defaultData } = await getRoleDetailApi(this.roleId);
      // console.log(defaultData, "!!!");

      this.$nextTick(() => {
        this.defaultAssign =
          defaultData.permIds.length > 0 ? [...defaultData.permIds] : [];
      });

      this.treeLoading = false;
    },
    //获取权限点
    handleNodeClick(data) {
      // console.log(data, "111");
    },
    //勾选或取消勾选权限
    // handleChangeAssignClick(checkNodes, checkId) {
    //   if (checkId === true) {
    //     this.permIds.push(checkNodes.id);
    //   } else if (checkId === false) {
    //     this.permIds = this.permIds.filter((item) => item !== checkNodes.id);
    //   }
    // },
    //确定分配
    async confirmAddAssign() {
      this.permIds = this.$refs.tree.getCheckedKeys();
      await giveAssignToRoleApi({ id: this.roleId, permIds: this.permIds });
      this.$message.success("权限分配成功");
      this.closeAssignDialog();
    },
  },
  computed: {
    title() {
      if (this.form.id) {
        return "编辑角色";
      } else {
        return "添加角色";
      }
    },
    ...mapState("user", ["userInfo"]),
  },
};
</script>

<style></style>
