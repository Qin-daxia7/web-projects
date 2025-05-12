/** @type {import('vls').VeturConfig} */
module.exports = {
  projects: [
    {
      root: "./", // 你的 Vue 项目根目录
      package: "./package.json",
      tsconfig: "./tsconfig.json",
      snippetFolder: "./.vscode/vetur/snippets",
      globalComponents: [
        "./src/components/**/*.vue", // 让 Vetur 识别全局组件
      ],
    },
  ],
};
