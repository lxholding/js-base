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
    // 不需要行结束符
    semi: 'off',
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
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号
    'comma-dangle': ['error', 'only-multiline'],
    // 不允许对 function 的参数进行重新赋值
    'no-param-reassign': 'off',
    // 禁止出现未使用过的变量
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
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
}
