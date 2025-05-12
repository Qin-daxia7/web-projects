"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

// 定义一个函数来解析路径
function resolve(dir) {
  return path.join(__dirname, dir);
}

// 获取项目的名称，默认为 "vue Admin Template"
const name = defaultSettings.title || "vue Admin Template";

// 读取环境变量中的端口号
const port = process.env.VUE_APP_PORT;
const cdn = {
  css: [
    "https://unpkg.com/element-ui/lib/theme-chalk/index.css", // element-ui css 样式表
  ],
  js: [
    // vue must at first!
    "https://cdn.jsdelivr.net/npm/vue@2.6.14", // vuejs
    "https://unpkg.com/element-ui/lib/index.js", // element-ui js
    "https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/jszip.min.js",
    "https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js",
    "https://cdn.jsdelivr.net/npm/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js",
  ],
};
module.exports = {
  /**
   * publicPath 是 Vue CLI 项目的基本 URL，决定了应用程序的根路径。
   * 若部署在子路径下，如 GitHub Pages (https://foo.github.io/bar/)，
   * 则 publicPath 需要设置为 "/bar/"，通常建议使用 "/"
   */
  publicPath: "/", // 使用相对路径
  outputDir: "dist", // 指定构建输出目录
  assetsDir: "static", // 静态资源存放目录
  lintOnSave: process.env.NODE_ENV === "development", // 仅在开发环境下启用 ESLint
  productionSourceMap: false, // 生产环境下不生成 source map 以提升构建速度

  // 配置开发服务器
  devServer: {
    port: port, // 端口号
    open: true, // 自动打开浏览器
    overlay: {
      warnings: false, // 是否显示警告
      errors: true, // 是否显示错误
    },
    // 配置代理，解决跨域问题
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BASE_URL_API, // 代理目标后端服务器地址
        changeOrigin: true, // 允许跨域
        // pathRewrite 可用于重写路径，例如将 "/api" 替换为空，使得请求 /api/users 变为 /users
        // pathRewrite: { '^/api': '' }
      },
    },
    // mock 数据，可选
    // before: require('./mock/mock-server.js')
  },

  // Webpack 配置
  configureWebpack: {
    name: name, // 设置 Webpack 打包后的应用名称
    externals: {
      // key(要排除的包名), value(引入的CDN包的全局变量名)
      vue: "Vue",
      "element-ui": "ELEMENT",
      xlsx: "XLSX",
      "cos-js-sdk-v5": "COS",
    },
    resolve: {
      alias: {
        "@": resolve("src"), // 设置路径别名，@ 代表 src 目录
      },
    },
  },

  // Webpack 链式调用配置
  chainWebpack(config) {
    // 启用 preload 以优化首屏加载
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/], // 忽略不必要的文件
        include: "initial",
      },
    ]);

    // 禁用 prefetch 以减少不必要的请求
    config.plugins.delete("prefetch");

    // 注入cdn变量 (打包时会执行)
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn; // 配置cdn给插件
      return args;
    });
    // 配置 svg-sprite-loader 以便使用 SVG 图标
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // 生产环境优化配置
    config.when(process.env.NODE_ENV !== "development", (config) => {
      // 将 runtime 代码内联到 HTML 以减少额外请求
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();

      // 拆分代码块，优化性能
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs", // 统一第三方库打包
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          elementUI: {
            name: "chunk-elementUI", // 单独打包 Element UI
            priority: 20, // 权重高于其他库
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // 适配 cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // 提取公共组件
            minChunks: 3, // 组件被引用至少 3 次才会提取
            priority: 5,
            reuseExistingChunk: true, // 复用已有 chunk
          },
        },
      });
      // 将 runtime 代码提取到单独的文件
      config.optimization.runtimeChunk("single");
    });
  },
};
