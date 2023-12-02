'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _debug = _interopRequireDefault(require('debug'));

var _core = require('@verdaccio/core');

var _memoryHandler = _interopRequireDefault(require('./memory-handler'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const debug = (0, _debug.default)('verdaccio:plugin:storage:local-memory');
const DEFAULT_LIMIT = 1000;

class LocalMemory {
  constructor(config, options) {
    this.config = config;
    this.limit = config.limit || DEFAULT_LIMIT;
    this.logger = options.logger;
    this.data = this._createEmtpyDatabase();
    this.path = '/';
    debug('start plugin');
  }

  init() {
    return Promise.resolve();
  }

  getSecret() {
    return Promise.resolve(this.data.secret);
  }

  setSecret(secret) {
    return new Promise((resolve) => {
      this.data.secret = secret;
      resolve(null);
    });
  }

  async add(name) {
    return new Promise((resolve, reject) => {
      const { list } = this.data;

      if (list.length < this.limit) {
        if (list.indexOf(name) === -1) {
          list.push(name);
        }

        resolve();
      } else {
        this.logger.info(
          {
            limit: this.limit,
          },
          'Storage memory has reached limit of @{limit} packages'
        );
        reject(new Error('Storage memory has reached limit of limit packages'));
      }
    });
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars

  search(onPackage, onEnd) {
    this.logger.warn('[verdaccio/memory]: search method not implemented, PR is welcome');
    onEnd();
  }

  async remove(name) {
    return new Promise((resolve) => {
      const { list } = this.data;
      const item = list.indexOf(name);

      if (item !== -1) {
        list.splice(item, 1);
      }

      return resolve();
    });
  }

  async get() {
    var _this$data, _this$data$list, _this$data2;

    debug(
      'data list length %o',
      (_this$data = this.data) === null || _this$data === void 0
        ? void 0
        : (_this$data$list = _this$data.list) === null || _this$data$list === void 0
          ? void 0
          : _this$data$list.length
    );
    return Promise.resolve(
      (_this$data2 = this.data) === null || _this$data2 === void 0 ? void 0 : _this$data2.list
    );
  }

  getPackageStorage(packageInfo) {
    return new _memoryHandler.default(packageInfo, this.data.files, this.logger);
  }

  _createEmtpyDatabase() {
    const list = [];
    const files = {};
    const emptyDatabase = {
      list,
      files,
      secret: '',
    };
    return emptyDatabase;
  }

  saveToken() {
    this.logger.warn('[verdaccio/memory][saveToken] save token has not been implemented yet');
    return Promise.reject(_core.errorUtils.getServiceUnavailable('method not implemented'));
  }

  deleteToken(user, tokenKey) {
    this.logger.warn(
      {
        tokenKey,
        user,
      },
      '[verdaccio/memory][deleteToken] delete token has not been implemented yet @{user}'
    );
    return Promise.reject(_core.errorUtils.getServiceUnavailable('method not implemented'));
  }

  readTokens() {
    this.logger.warn('[verdaccio/memory][readTokens] read tokens has not been implemented yet ');
    return Promise.reject(_core.errorUtils.getServiceUnavailable('method not implemented'));
  }
}

var _default = LocalMemory;
exports.default = _default;
//# sourceMappingURL=local-memory.js.map
