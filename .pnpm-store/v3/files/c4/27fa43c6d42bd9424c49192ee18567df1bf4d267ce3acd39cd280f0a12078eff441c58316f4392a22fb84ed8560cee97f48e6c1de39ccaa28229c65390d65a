'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensure = require('@commitlint/ensure');

var ensure = _interopRequireWildcard(_ensure);

var _message = require('@commitlint/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = (parsed, when, value) => {
	if (!parsed.scope) {
		return [true, ''];
	}

	const negated = when === 'never';
	const result = value.length === 0 || ensure.enum(parsed.scope, value);

	return [negated ? !result : result, (0, _message2.default)([`scope must`, negated ? `not` : null, `be one of [${value.join(', ')}]`])];
};

module.exports = exports.default;
//# sourceMappingURL=scope-enum.js.map