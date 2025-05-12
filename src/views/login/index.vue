<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 放置标题图片 @是设置的别名-->
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="" />
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- @click.native.prevent -->
      <!-- .native的作用：给组件的最外层标签绑定原生事件 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        class="loginBtn"
        >登录</el-button
      >

      <div class="tips">
        <span style="margin-right: 20px">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Login",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length >= 6 && value.length <= 16) {
        callback();
      } else if (value.length === 0) {
        callback("密码不能为空");
      } else {
        callback("密码长度应该在6-16位");
      }
    };
    return {
      loginForm: {
        mobile: "13800000002",
        password: "123456",
      },
      loginRules: {
        mobile: [
          { required: true, trigger: "blur", message: "手机号不能为空" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  computed: {
    ...mapGetters(["routes"]),
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(async (flag) => {
        if (!flag) {
          return;
        }
        //接口请求之前开始 进行加载中，响应之后 取消加载中的状态
        this.loading = true;
        try {
          await this.$store.dispatch("user/setToken", this.loginForm);
          //从哪个页面退出的就应该跳转到哪个页面
          const res = this.$route.query.redirect;
          if (res && this.loginForm.mobile === "13800000002") {
            this.$router.push(res);
          } else {
            this.$router.push("/");
          }
        } catch (error) {
        } finally {
          //不管你前面执行的是try还是catch 最后都会执行finally
          this.loading = false;
        }
        // console.log(process.env.VUE_APP_BASE_URL_API);
        //跳转的时候拿到响应结果，如果用户名密码正确跳转到首页，如果错误提示密码错误
        // this.$router.push('/')
        // console.log(res);
      });
    },
  },
  created() {
    if (process.env.VUE_APP_BASE_URL_API == "http://ihrm-java.itheima.net") {
      this.loginForm.password = "hm#qd@23!";
    }
    // console.log(process.env.VUE_APP_BASE_URL_API);
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #407ffe; // 修改输入框字体颜色 (该变量在两个style标签中都有声明)
$cursor: #407ffe;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  // css中如果让@指向src必须加上~（四年前）
  background-image: url("~@/assets/common/login.jpg"); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.9); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
  //第一个style标签中修改
  .el-form-item__error {
    color: #fff;
    font-size: 14px;
  }
  //第一个style标签中修改
  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
