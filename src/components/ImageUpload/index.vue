<template>
  <div :class="{ disabled: fileList.length >= limit }">
    <!-- action：要把图片上传到哪个服务器（图片服务器的地址） 
     自己搭建服务器，一般使用action上传-->
    <!-- list-style：上传组件样式的控制 -->
    <!-- on-preview：图片预览 -->
    <!-- limit：图片上传的最大文件数-->
    <!-- on-exceed：上传超过最大限制时触发的函数 -->
    <!-- :http-request 自定义上传 -->
    <!-- :on-change 文件状态改变，上传成功上传失败都会执行 -->
    <el-upload
      action="#"
      :file-list="fileList"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :limit="limit"
      :on-exceed="onExceed"
      :http-request="httpRequest"
      :on-change="onChange"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible"
      title="图片预览"
      :close-on-click-modal="false"
    >
      <img
        v-if="fileList.length > 0"
        width="100%"
        :src="dialogImageUrl"
        alt=""
      />
    </el-dialog>
  </div>
</template>

<script>
import cos from "@/utils/cos";
import obs from "@/utils/obs";
export default {
  name: "ImageUpload",
  props: {
    limit: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
    };
  },
  mounted() {
    this.hideUpload();
  },
  computed: {
    //判断fileList里面的图片有没有全部上传成功
    isAllUploadSuccess() {
      return this.fileList.every((item) => item.status === "success");
    },
  },
  methods: {
    //移除图片
    //file删除的文件
    //fileList未删除的文件
    handleRemove(file, fileList) {
      //this.fileList = fileList//引用赋值，两个数组指向同一个地址，其中一个数组修改数据，另外一个数组的数据也会发生变化
      //浅拷贝两个数组执行不同地址，防止一个数组修改数据，导致两个数组数据发生变化与
      //   this.fileList = [...fileList];
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
    },
    //图片预览
    handlePictureCardPreview(file) {
      //   console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //超出图片限制执行函数
    onExceed() {
      this.$message({ message: "图片数已经达到最大限制" });
    },
    //到达上限隐藏上传框
    hideUpload() {
      const upload = document.getElementsByClassName(
        "el-upload--picture-card"
      )[0];
      //   console.log(upload);
    },
    //自定义文件上传
    async httpRequest({ file }) {
      //腾讯云
      const curFile = this.fileList.find((item) => (item.uid = file.uid));
      curFile.status = "uploading";
      cos.uploadFile(
        {
          Bucket:
            "hrsass-3-19-1349726542" /* 存储桶的名字      填写自己的 bucket，必须字段 )*/,
          Region: "ap-guangzhou" /* 存储桶所在地域，必须字段 */,
          Key: +new Date() + file.name /* 文件名*/,
          Body: file, // 上传文件对象
          SliceSize:
            1024 *
            1024 *
            5 /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */,
          //   ACL: "public-read", // 设置文件为公有读
          //   Headers: {
          //     "Content-Type": file.type, // 关键！让服务器返回正确的 Content-Type
          //     "Content-Disposition": "inline", // 确保浏览器直接打开，而不是下载
          //   },
          onProgress: function (progressData) {
            // console.log(JSON.stringify(progressData));
            curFile.percentage = progressData.percent * 100;
          },
        },
        (err, data) => {
          //上传之后的结果
          //error上传失败
          if (err) {
            this.$message.warning("上传失败，请稍后重试");
          } else {
            //找到对应的图片进行修改
            curFile.status = "success"; //如果想要进度条明显可以加个延时函数
            curFile.url = "//" + data.Location;
            //‘//’会默认根网站的协议保持统一
          }
        }
      );
      //华为云
      // console.log(file);
      // const curFile = this.fileList.find((item) => (item.uid = file.uid));
      // curFile.status = "uploading";
      // try {
      //   const params = {
      //     // 指定存储桶名称
      //     Bucket: "hrsass-3-19",
      //     // 指定对象名，此处以 example/objectname 为例
      //     Key: `${new Date().getTime()}_${file.name}`, //文件名
      //     // 指定文本对象
      //     Body: "file",
      //   };
      //   // 文本上传对象
      //   const result = await obs.putObject(params);
      //   console.log(result)
      //   if (result.CommonMsg.Status <= 300) {
      //     console.log(
      //       "Put object(%s) under the bucket(%s) successful!!",
      //       params.Key,
      //       params.Bucket
      //     );
      //     console.log("RequestId: %s", result.CommonMsg.RequestId);
      //     console.log(
      //       "StorageClass:%s, ETag:%s",
      //       result.InterfaceResult.StorageClass,
      //       result.InterfaceResult.ETag
      //     );
      //     return;
      //   }
      //   console.log(
      //     "An ObsError was found, which means your request sent to OBS was rejected with an error response."
      //   );
      //   console.log("Status: %d", result.CommonMsg.Status);
      //   console.log("Code: %s", result.CommonMsg.Code);
      //   console.log("Message: %s", result.CommonMsg.Message);
      //   console.log("RequestId: %s", result.CommonMsg.RequestId);
      // } catch (error) {
      //   console.log(
      //     "An Exception was found, which means the client encountered an internal problem when attempting to communicate with OBS, for example, the client was unable to access the network."
      //   );
      //   console.log(error);
      // }
    },
    //文件状态改变执行(file:上传的文件，fileList:文件列表)
    onChange(file, fileList) {
      //把上传之后的文件，同步给data里面的fileList
      this.fileList = [...fileList];
    },
    //文件上传前执行的校验
    beforeUpload(file) {
      const fileType = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/svg+xml",
        "image/bmp",
      ];
      if (!fileType.includes(file.type)) {
        this.$message.warning("图片格式不正确！，请重新上传");
        return false;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.$message.warning("图片大小不能超过2M");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
//控制.disabled底下的.el-upload--picture-card显示与隐藏
.disabled {
  ::v-deep {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
