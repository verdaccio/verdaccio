"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginSyntaxThrowExpressions = _interopRequireDefault(require("@babel/plugin-syntax-throw-expressions"));

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "proposal-throw-expressions",
    inherits: _pluginSyntaxThrowExpressions.default,
    visitor: {
      UnaryExpression(path) {
        const {
          operator,
          argument
        } = path.node;
        if (operator !== "throw") return;

        const arrow = _core.types.functionExpression(null, [_core.types.identifier("e")], _core.types.blockStatement([_core.types.throwStatement(_core.types.identifier("e"))]));

        path.replaceWith(_core.types.callExpression(arrow, [argument]));
      }

    }
  };
});

exports.default = _default;