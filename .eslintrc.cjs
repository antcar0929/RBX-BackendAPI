module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'prefer-const': 2,
    'no-unused-vars': 2,
    'no-use-before-define': 2,
    eqeqeq: 2,
  },
}
