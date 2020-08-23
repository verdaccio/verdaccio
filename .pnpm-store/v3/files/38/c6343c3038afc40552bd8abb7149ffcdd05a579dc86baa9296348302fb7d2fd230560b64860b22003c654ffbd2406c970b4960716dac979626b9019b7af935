"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseReadme;

var _marked = _interopRequireDefault(require("marked"));

var _dompurify = _interopRequireDefault(require("dompurify"));

var _jsdom = require("jsdom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DOMPurify = (0, _dompurify.default)(new _jsdom.JSDOM('').window);

function parseReadme(readme) {
  if (readme) {
    return DOMPurify.sanitize((0, _marked.default)(readme, {
      sanitize: false
    }).trim());
  }

  return;
}