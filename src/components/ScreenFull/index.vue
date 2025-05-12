<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon
      :icon-class="isFullScreen ? 'exit-fullscreen' : 'fullscreen'"
      class="fullscreen"
      @click="tobeBigScreen"
    />
  </div>
</template>

<script>
import screenfull from "screenfull";
export default {
  data() {
    return {
      isFullScreen: false,
    };
  },
  name: "ScreenFull",
  methods: {
    tobeBigScreen() {
      if (screenfull.isEnabled) {
        this.isFullScreen = !this.isFullScreen;
        screenfull.toggle();
      } else {
        this.$message.waring("亲！您的浏览器不支持全屏，请下载新版浏览器");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
