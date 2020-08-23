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

const negated = when => when === 'never';

exports.default = (parsed, when, value) => {
	const header = parsed.header;


	if (typeof header !== 'string' || !header.match(/^[a-z]/i)) {
		return [true];
	}

	const checks = (Array.isArray(value) ? value : [value]).map(check => {
		if (typeof check === 'string') {
			return {
				when: 'always',
				case: check
			};
		}
		return check;
	});

	const result = checks.some(check => {
		const r = ensure.case(header, check.case);
		return negated(check.when) ? !r : r;
	});

	const list = checks.map(c => c.case).join(', ');

	return [negated(when) ? !result : result, (0, _message2.default)([`header must`, negated(when) ? `not` : null, `be ${list}`])];
};

module.exports = exports.default;
//# sourceMappingURL=header-case.js.map