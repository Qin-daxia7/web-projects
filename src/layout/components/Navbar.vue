<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="app-breadcrumb">
      {{ $t("navbar.companyName") }}
      <span class="breadBtn">{{ $t("navbar.version") }}</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <Lang class="right-menu-item" />
      <screenfull class="right-menu-item" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 事件onerror：触发时机，当图片加载失败的时候就自动触发这个函数 -->
          <img :src="staffPhoto" class="user-avatar" v-imgError="defaultImg" />
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>

        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>{{ $t("navbar.dashboard") }}</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://xxx.com">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">{{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-button size="small" @click="openAiDialog()">AI助手</el-button>
    <AiDialog :showAiDialog.sync="showAiDialog"/>
  </div>
</template>

<script>
import { getCompanyDepartment, getUserSalaryApi } from "@/api/user";
import Img from "@/assets/common/head.jpg";
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import { resetRouter } from "@/router";
import screenfull from "screenfull";

export default {
  data() {
    return {
      //webpack不支持这个写法
      //如果在脚手架的环境下，想把本地图片当成默认图，需要先把图片进行导入，然后再使用
      defaultImg: Img,
      showAiDialog: false,
    };
  },
  components: {
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "staffPhoto", "id"]),
  },
  created() {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    //打开ai聊天框
    openAiDialog() {
      this.showAiDialog = !this.showAiDialog;
    },
    async logout() {
      //清除用户信息
      this.$store.commit("user/LOGOUT");
      //1、清空路由对象中的规则
      resetRouter();
      //2、清空Vuex
      this.$store.commit("routes/RESETROUTES", []);
      // this.$route.fullPath获取当前路径
      ///login?redirect=${this.$route.fullPath}当你退出的时候，记录下你是从哪个页面退出的
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    errorEvent(e) {
      e.target.src = this.defaultImg;
    },
    async test() {
      const arr = await getUserSalaryApi(this.id);
      console.log(arr);
      console.log(arr, "/company/department");
    },

  },
};
</script>

<style lang="scss" scoped>
.navbar {
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      text-align: center;
      // vertical-align: middle;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-wrapper {
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        vertical-align: middle;
      }
      .name {
        cursor: pointer;
        color: #fff;
        vertical-align: middle;
        margin-left: 5px;
      }
      .user-dropdown {
        color: #fff;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>
