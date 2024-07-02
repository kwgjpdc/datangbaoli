/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  parser: 'vue-eslint-parser',
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off'
  },
  overrides: [
    {
      files: ['*.html'],
      processor: 'vue/.vue'
    }
  ]
};
