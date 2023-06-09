module.exports = {
  root: true,
  extends: [
    // lint vue 文件
    // eslint-config-taro配置包中没有引入依赖eslint-plugin-vue
    // 所以需要项目安装eslint-plugin-vue
    'taro/vue3',
    // eslint 集成prettier 规则，
    // 需要先安装
    // eslint-config-prettier
    // eslint-plugin-prettier
    // 1. disabled掉eslint中和prettier想冲突的规则
    // 2. 实时以eslint 提示的方式显示prettier规则
    // @see https://github.com/prettier/eslint-plugin-prettier
    'plugin:prettier/recommended',
  ],
  rules: {},
  // 方式一：
  // lint js?(x) ts?(x)文件
  // eslint-config-taro 没有引入相关依赖
  // 需要项目单独安装：
  // "eslint-plugin-import": "^2.26.0",
  // "eslint-plugin-react": "^7.30.0",
  // "eslint-plugin-react-hooks": "^4.5.0",
  // glob functionally: https://github.com/isaacs/node-glob
  overrides: [{ files: ['**/*.js?(x)', '**/*.ts?(x)'], extends: ['taro'] }],
};
