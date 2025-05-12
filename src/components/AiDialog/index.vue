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
      const text = this.input.trim(); // 获取输入框内容并去除两边空格
      if (!text) return; // 如果输入为空，则不发送消息

      // 将用户消息添加到消息列表中
      this.messages.push({ role: "user", text });
      this.input = ""; // 清空输入框

      // 将当前的用户消息转换为符合AI接口要求的格式
      const currentMessage = {
        role: "user",  // 当前消息是用户消息
        content: text  // 当前输入的文本
      };

      // 创建一个占位符，用于显示AI的响应
      const aiMsg = { role: "ai", text: "" };
      this.messages.push(aiMsg);

      try {
        // 发送请求到后端获取AI的响应
        const response = await fetch("http://localhost:4000/deepseek", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: [currentMessage] }), // 仅发送当前消息
        });
        console.log(JSON.stringify({ messages: [currentMessage] }));

        // 如果响应失败或没有body，抛出错误
        if (!response.ok || !response.body) {
          throw new Error("AI服务请求失败");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let resultText = "";

        // 使用流式读取，逐步解析数据
        while (true) {
          const { value, done } = await reader.read();
          if (done) break; // 数据读取完毕

          const chunk = decoder.decode(value, { stream: true });

          // 逐行解析流数据
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            try {
              const jsonStr = line.startsWith("data: ") ? line.slice(6) : line;
              const json = JSON.parse(jsonStr);

              const content = json.data?.content;
              if (content) {
                resultText += content; // 累积AI的回答
                aiMsg.text = resultText; // 更新占位符内容
                // 使用 Vue 的响应式更新 DOM
              }
            } catch (err) {
              console.warn("解析失败：", line);
            }
          }
        }
      } catch (err) {
        aiMsg.text = "[AI 响应失败]"; // 如果请求出错，显示错误信息
        console.error(err);
      }
    },
  },
};
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
