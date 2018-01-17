// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    mocha: true,
    es6: true
  },
  globals: {
    io: true
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: ['html'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.config.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // 使用default export
    // 'prefer-default-export': 'off',
    // don't require .vue extension when importing
    // 'import/extensions': [
    //   'error',
    //   'always',
    //   {
    //     js: 'never',
    //     vue: 'never'
    //   }
    // ],
    // 换行符号规则
    'linebreak-style': 'off',
    'max-len': ['error', { code: 125, comments: 130 }],
    // 建议使用export default
    'import/prefer-default-export': 'off',
    // 引号设置
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    // 对象花括号换行
    'object-curly-newline': [
      'error',
      {
        multiline: true
      }
    ],
    // 操作符混合使用
    'no-mixed-operators': 'off',
    // 生成器*号位置
    'generator-star-spacing': ['error', { before: true, after: false }],
    // yield委托*号位置
    'yield-star-spacing': ['error', { before: true, after: false }],
    'prefer-arrow-callback': 'off',
    // 禁止自增运算符
    'no-plusplus': 'off',
    // 立即执行函数表达式调用必须写在外部
    'wrap-iife': ['error', 'any'],
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号
    'comma-dangle': ['error', 'only-multiline'],
    // 不允许对 function 的参数进行重新赋值
    'no-param-reassign': 'off',
    // 禁止出现未使用过的变量
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    // 'max-len': ['error', { 'code': 150, 'comments': 120 }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js']
      }
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};
