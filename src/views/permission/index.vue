<template>
  <div class="permission-container">
    <el-card>
      <div style="text-align: right; margin-bottom: 20px">
        <el-button type="primary" size="small" @click="openDialog(0)"
          >添加权限</el-button
        >
      </div>
      <el-table
        border
        :data="treeList"
        v-loading="isLoading"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="标识" prop="code"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="openDialog(row.id)"
              >添加权限点</el-button
            >
            <el-button size="small" @click="editPermission(row.id)"
              >查看</el-button
            >
            <el-button size="small" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增 -->
    <el-dialog :visible="showDialolg" @close="closeDialog" :title="title">
      <el-form
        label-width="100px"
        :rules="rules"
        :model="form"
        ref="form"
        v-loading="isLoading"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="form.code"> </el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="form.enVisible"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="不启用"
          >
          </el-switch>
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="confirmAddPersion">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionsListApi,
  addPermissionApi,
  delPermissionApi,
  editPermissionApi,
  getPermissionsDetailApi,
} from "@/api/permission";
import { title } from "@/settings";
import { makeTreeData } from "@/utils";
export default {
  name: "Permission",
  data() {
    return {
      //一维数组结构
      list: [],
      //树状数据结构
      treeList: [],
      //添加控制
      showDialolg: false,
      //表单数据
      form: {
        name: "",
        code: "",
        description: "",
        type: "", //类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: "",
        enVisible: "1", // 启用禁用, 0禁用, 1启用
      },
      //校验规则
      rules: {
        name: [
          {
            required: true,
            message: "权限名称不能为空",
            trigger: ["blur", "change"],
          },
          {
            min: 2,
            max: 10,
            message: "权限名称字符在2-10个",
            trigger: ["blur", "change"],
          },
          { validator: this.validateName, trigger: ["blur", "change"] },
        ],
        code: [
          {
            required: true,
            message: "权限标识不能为空",
            trigger: ["blur", "change"],
          },
          {
            min: 2,
            max: 20,
            message: "权限标识字符在2-20个",
            trigger: ["blur", "change"],
          },
          { validator: this.validateCode, trigger: ["blur", "change"] },
        ],
        description: [
          {
            required: true,
            message: "权限描述不能为空",
            trigger: ["blur", "change"],
          },
        ],
      },
      //加载控制
      isLoading: false,
    };
  },
  computed: {
    title() {
      if (this.form.id) {
        return "编辑权限";
      } else {
        return "添加权限";
      }
    },
  },
  created() {
    //获取权限列表
    this.getPermissionsList();
  },
  methods: {
    //获取权限列表
    async getPermissionsList() {
      this.isLoading = true;
      const { data } = await getPermissionsListApi();
      this.list = data;
      this.treeList = makeTreeData(data, "0");
      this.isLoading = false;
    },
    //打开添加权限dialog
    openDialog(id) {
      this.showDialolg = true;
      if (id == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
      this.form.pid = id;
    },
    //关闭弹窗
    closeDialog() {
      this.showDialolg = false;
      this.form = {
        name: "",
        code: "",
        description: "",
        type: "", //类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: "",
        enVisible: "1", // 启用禁用, 0禁用, 1启用
      };
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    //名称校验
    validateName(rule, value, callback) {
      if (this.form.id) {
        const res = this.list.some(
          (item) => item.name == value && item.id !== this.form.id
        );
        if (res) {
          callback(new Error("权限名称不能重复"));
          return;
        }
      } else {
        const res = this.list.some((item) => item.name == value);
        if (res) {
          callback(new Error("权限名称不能重复"));
          return;
        }
      }
      callback();
    },
    //标识校验
    validateCode(rule, value, callback) {
      if (this.form.id) {
        const res = this.list.some(
          (item) => item.code === value && item.id !== this.form.id
        );
        if (res) {
          callback(new Error("权限标识不能重复"));
          return;
        }
      } else {
        const res = this.list.some((item) => item.code === value);
        if (res) {
          callback(new Error("权限标识不能重复"));
          return;
        }
      }
      callback();
    },
    //确定添加权限
    confirmAddPersion() {
      this.$refs.form.validate(async (flag) => {
        if (!flag) return;
        if (this.form.id) {
          await editPermissionApi(this.form);
          this.$message.success("权限点编辑成功");
        } else {
          await addPermissionApi(this.form);
          this.$message.success("权限点添加成功");
        }
        this.getPermissionsList();
        this.closeDialog();
      });
    },
    //删除权限
    delPermission(id) {
      this.$confirm("您确认要删除这个权限点吗？", "温馨提示")
        .then(async () => {
          await delPermissionApi(id);
          this.$message.success("删除成功");
          this.getPermissionsList();
        })
        .catch(() => {});
    },
    //获取权限详情
    async getPermissionsDetail(id) {
      this.isLoading = true;
      const { data } = await getPermissionsDetailApi(id);
      this.form = { ...data };
      this.isLoading = false;
    },
    //编辑权限点
    editPermission(id) {
      this.getPermissionsDetail(id);
      this.openDialog();
    },
  },
};
</script>

<style></style>
