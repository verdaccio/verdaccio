/* eslint prefer-rest-params:off */

export const spliceURL = function spliceURL(...args) {
  return Array.from(args).reduce((lastResult, current) => lastResult + current).replace(/([^:])(\/)+(.)/g, `$1/$3`);
};
