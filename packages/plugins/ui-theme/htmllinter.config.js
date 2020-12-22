module.exports = {
  extend: require('@htmllinter/basic-config'),
  rules: {
    'long-line-content': ['on', { maxLen: 120 }],
  },
};
