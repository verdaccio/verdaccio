/* eslint-disable @typescript-eslint/no-unused-vars */
let Reflect;
let idObj;

function checkIsNodeV6OrAbove() {
  if (typeof process === 'undefined') {
    return false;
  }

  return parseInt(process.versions.node.split('.')[0], 10) >= 6;
}

if (!checkIsNodeV6OrAbove()) {
  Reflect = require('harmony-reflect');
}

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
