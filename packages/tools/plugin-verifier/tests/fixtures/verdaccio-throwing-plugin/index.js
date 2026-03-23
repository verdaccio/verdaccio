// This plugin throws during instantiation
module.exports = function () {
  throw new Error('Plugin initialization failed');
};
