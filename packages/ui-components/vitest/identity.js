/* eslint-disable @typescript-eslint/no-unused-vars */
let idObj;

idObj = new Proxy(
  {},
  {
    get: function getter(target, key) {
      if (key === '__esModule') {
        return false;
      }
      return key;
    },
  }
);

module.exports = idObj;
