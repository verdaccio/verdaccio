"use strict";

var _fs = require("fs");

var _path = require("path");

var _globals = _interopRequireDefault(require("./globals.json"));

var snapshotProcessor = _interopRequireWildcard(require("./processors/snapshot-processor"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// copied from https://github.com/babel/babel/blob/d8da63c929f2d28c401571e2a43166678c555bc4/packages/babel-helpers/src/helpers.js#L602-L606

/* istanbul ignore next */
const interopRequireDefault = obj => obj && obj.__esModule ? obj : {
  default: obj
};

const importDefault = moduleName => // eslint-disable-next-line @typescript-eslint/no-require-imports
interopRequireDefault(require(moduleName)).default;

const rulesDir = (0, _path.join)(__dirname, 'rules');
const excludedFiles = ['__tests__', 'utils'];
const rules = (0, _fs.readdirSync)(rulesDir).map(rule => (0, _path.parse)(rule).name).filter(rule => !excludedFiles.includes(rule)).reduce((acc, curr) => Object.assign(acc, {
  [curr]: importDefault((0, _path.join)(rulesDir, curr))
}), {});
const allRules = Object.keys(rules).reduce((rules, key) => _objectSpread({}, rules, {
  [`jest/${key}`]: 'error'
}), {});
module.exports = {
  configs: {
    all: {
      plugins: ['jest'],
      env: {
        'jest/globals': true
      },
      rules: allRules
    },
    recommended: {
      plugins: ['jest'],
      env: {
        'jest/globals': true
      },
      rules: {
        'jest/expect-expect': 'warn',
        'jest/no-commented-out-tests': 'warn',
        'jest/no-disabled-tests': 'warn',
        'jest/no-export': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-jest-import': 'error',
        'jest/no-mocks-import': 'error',
        'jest/no-jasmine-globals': 'warn',
        'jest/no-standalone-expect': 'error',
        'jest/no-test-callback': 'error',
        'jest/no-test-prefixes': 'error',
        'jest/no-try-expect': 'error',
        'jest/valid-describe': 'error',
        'jest/valid-expect': 'error',
        'jest/valid-expect-in-promise': 'error'
      }
    },
    style: {
      plugins: ['jest'],
      rules: {
        'jest/no-alias-methods': 'warn',
        'jest/prefer-to-be-null': 'error',
        'jest/prefer-to-be-undefined': 'error',
        'jest/prefer-to-contain': 'error',
        'jest/prefer-to-have-length': 'error'
      }
    }
  },
  environments: {
    globals: {
      globals: _globals.default
    }
  },
  processors: {
    '.snap': snapshotProcessor
  },
  rules
};