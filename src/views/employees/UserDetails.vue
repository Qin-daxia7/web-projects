<template>
  <div class="employees-detail-container">
    <div class="app-container">
      <el-card>
        <!-- 放置表单 -->
        <!-- :model="userInfo" 为表单校验提供数据来源 -->
        <el-form
          :model="userInfo"
          label-width="120px"
          style="margin-left: 120px; margin-top: 30px"
          ref="userForm"
          :rules="rules"
        >
          <el-form-item label="姓名:" prop="username">
            <el-input style="width: 300px" v-model="userInfo.username" />
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input style="width: 300px" disabled v-model="userInfo.mobile" />
          </el-form-item>
          <el-form-item label="入职时间">
            <el-date-picker
              type="date"
              class="inputW"
              v-model="userInfo.timeOfEntry"
            />
          </el-form-item>
          <el-form-item label="员工头像">
            <ImageUpload :limit="limit" ref="staffPhoto" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUSerInfo">更新</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailApi, updateUserInfoApi } from "@/api/employees";
export default {
  name: "EmployeesDetail",
  data() {
    return {
      //照片上传限制数量
      limit: 1,
      userInfo: {
        timeOfEntry: "", // 入职时间
        username: "", // 姓名
        mobile: "", // 手机
        staffPhoto: "", //头像
      },
      rules: {
        username: [
          { required: true, message: "用户名不可为空", trigger: "blur" },
        ],
        timeOfEntry: [
          { required: true, message: "入职时间不可为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    //获取详细信息
    async getUserInfo() {
      const id = this.$route.params.id;
      const { data } = await getUserDetailApi(this.$route.params.id);
      this.userInfo = data;
      this.$refs.staffPhoto.fileList = [
        {
          url: data.staffPhoto,
        },
      ];
      //   console.log(data);
    },
    updateUSerInfo() {
      this.$refs.userForm.validate(async (flag) => {
        if (!flag) return;
        //获取头像，获取头像之后赋值给userInfo
        const staffPhoto = this.$refs.staffPhoto;
        if (staffPhoto.fileList[0]?.url) {
          this.userInfo.staffPhoto = staffPhoto.fileList[0].url;
          //处理上传中的情况
          if (!staffPhoto.isAllUploadSuccess) {
            this.$message.warning("还有图片正在上传中，请上传完成后再更新");
            return;
          }
          await updateUserInfoApi(this.userInfo);
          this.$message({ message: "员工信息更新成功", type: "success" });
        } else {
          this.$message.warning("请先上传图片再点击更新");
          return;
        }
      });
    },
  },
};
</script>
