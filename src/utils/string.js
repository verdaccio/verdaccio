/* eslint prefer-rest-params:off */

module.exports.spliceURL = function spliceURL() {
  return Array.from(arguments).reduce((lastResult, current) => lastResult + current).replace(/([^:])(\/)+(.)/g, `$1/$3`);
};
