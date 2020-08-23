"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ResizeableBuffer = /*#__PURE__*/function () {
  function ResizeableBuffer() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    _classCallCheck(this, ResizeableBuffer);

    this.size = size;
    this.length = 0;
    this.buf = Buffer.alloc(size);
  }

  _createClass(ResizeableBuffer, [{
    key: "prepend",
    value: function prepend(val) {
      var length = this.length++;

      if (length === this.size) {
        this.resize();
      }

      var buf = this.clone();
      this.buf[0] = val;
      buf.copy(this.buf, 1, 0, length);
    }
  }, {
    key: "append",
    value: function append(val) {
      var length = this.length++;

      if (length === this.size) {
        this.resize();
      }

      this.buf[length] = val;
    }
  }, {
    key: "clone",
    value: function clone() {
      return Buffer.from(this.buf.slice(0, this.length));
    }
  }, {
    key: "resize",
    value: function resize() {
      var length = this.length;
      this.size = this.size * 2;
      var buf = Buffer.alloc(this.size);
      this.buf.copy(buf, 0, 0, length);
      this.buf = buf;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.buf.slice(0, this.length).toString();
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toString();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.length = 0;
    }
  }]);

  return ResizeableBuffer;
}();

module.exports = ResizeableBuffer;