<template>
  <div>
    <el-dialog
      title="AI 聊天助手"
      :visible.sync="showAiDialog"
      width="1000px"
      @close="closeAiDialog"
      append-to-body="true"
      custom-class="import-class"
    >
      <!-- 聊天内容 -->
      <div class="chat-content">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
          :class="msg.role"
        >
          <span>{{ msg.role === 'user' ? '你' : 'AI' }}：</span>
          <span>{{ msg.text }}</span>
        </div>
      </div>

      <!-- 输入区 -->
      <div class="chat-input">
        <el-input
          v-model="input"
          placeholder="请输入内容..."
          @keyup.enter.native="sendMessage"
          clearable
        ></el-input>
        <el-button type="primary" @click="sendMessage" :disabled="!input">发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "", // 用户输入的消息
      messages: [], // 消息列表，包含用户和AI的对话
    };
  },
  props: {
    showAiDialog: {
      type: Boolean,
      default: false, // 控制对话框显示与否
    },
  },
  methods: {
    // 关闭对话框方法
    closeAiDialog() {
      this.$emit("closeAiDialog", false); // 向父组件发送关闭对话框的事件
    },

    async sendMessage() {
    }
  }
}
</script>

<style scoped>
.chat-content {
  height: 500px; /* 设置聊天内容区域的高度 */
  overflow-y: auto; /* 启用纵向滚动条 */
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f5f7fa; /* 背景颜色 */
  border-radius: 6px; /* 圆角边框 */
}

/* 关键：穿透到 .el-dialog 类，设置对话框的高度 */
::v-deep .el-dialog.import-class {
  height: 80vh; /* 设置对话框的高度为视口高度的80% */
}

.message {
  margin-bottom: 8px;
  padding: 4px 8px;
}

.message.user {
  text-align: right; /* 用户消息右对齐 */
  color: #409eff; /* 用户消息文字颜色 */
}

.message.ai {
  text-align: left; /* AI 消息左对齐 */
  color: #67c23a; /* AI 消息文字颜色 */
}

.chat-input {
  display: flex; /* 使用 flex 布局 */
  gap: 10px; /* 元素之间的间距 */
  margin-top: 10px;
}
</style>
