<template>
  <div>
    <el-dialog
      title="分配角色"
      :visible="showRoleDialog"
      :close-on-click-modal="false"
      @close="closeRoleDialog"
      @open="openDialog"
    >
      <el-checkbox-group v-model="roleIds">
        <el-checkbox
          label="110"
          v-for="(item, index) in list"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
      <template #footer>
        <div>
          <el-button type="primary" size="small" @click="assignRoles"
            >确定</el-button
          >
          <el-button size="small" @click="closeRoleDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getUserDetailApi, assignRolesApi } from "@/api/employees";
import { getRoleListApi } from "@/api/settings";

export default {
  name: "AssignRole",
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      list: [],
      roleIds: [],
      page: 1,
      pageSize: 100,
    };
  },
  created() {
    this.getRoleList();
    this.getUserDetail();
  },
  methods: {
    //获取员工列表
    async getRoleList() {
      const { data } = await getRoleListApi({
        page: this.page,
        pagesize: this.pageSize,
      });

      this.list = data.rows;
    },
    //获取员工详情
    async getUserDetail() {
      const {
        data: { roleIds },
      } = await getUserDetailApi(this.userId);
      this.roleIds = roleIds || [];
    },
    //关闭弹窗
    closeRoleDialog() {
      this.$emit("update:showRoleDialog", false);
    },
    //打开dialog时执行
    openDialog() {
      this.getRoleList();
      this.getUserDetail();
    },
    //权限提交
    async assignRoles() {
      await assignRolesApi({
        id: this.userId,
        roleIds: this.roleIds,
      });
      this.$message.success("授予权限成功");
      this.closeRoleDialog();
    },
  },
};
</script>

<style scoped></style>
