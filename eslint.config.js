import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  // 匹配所有 JavaScript、TypeScript 和 Vue 文件
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },

  // 设置全局变量，这里使用浏览器环境的全局变量
  { languageOptions: { globals: globals.browser } },

  // 使用 @eslint/js 插件的推荐配置
  pluginJs.configs.recommended,

  // 使用 typescript-eslint 插件的推荐配置
  ...tseslint.configs.recommended,

  // 使用 eslint-plugin-vue 插件的 "flat/essential" 配置
  ...pluginVue.configs["flat/essential"],

  // 针对 Vue 文件的特殊配置，使用 typescript-eslint 解析器
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
];
