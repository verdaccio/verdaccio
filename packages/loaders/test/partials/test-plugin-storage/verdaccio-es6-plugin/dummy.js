// this is how a Babel.js transpiled plugin looks like

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var Dummy = (function () {
  function Dummy(config, logger) {
    _classCallCheck(this, Dummy);

    this.config = config;
    this.logger = logger;
    this.data = [];
  }

  _createClass(Dummy, [
    {
      key: 'getPackageStorage',
      value: function getPackageStorage() {},
    },
  ]);

  return Dummy;
})();

exports.default = Dummy;
