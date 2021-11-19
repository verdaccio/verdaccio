'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

let _memoryHandler = require('./memory-handler');

let _memoryHandler2 = _interopRequireDefault(_memoryHandler);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const DEFAULT_LIMIT = 1000;

class LocalMemory {
  constructor(config, options) {
    this.config = config;
    this.limit = config.limit || DEFAULT_LIMIT;
    this.logger = options.logger;
    this.data = this._createEmtpyDatabase();
  }

  getSecret() {
    return Promise.resolve(this.data.secret);
  }

  setSecret(secret) {
    return new Promise((resolve, reject) => {
      this.data.secret = secret;
      resolve(null);
    });
  }

  add(name, cb) {
    const list = this.data.list;

    if (list.length < this.limit) {
      if (list.indexOf(name) === -1) {
        list.push(name);
      }
      cb(null);
    } else {
      this.logger.info(
        { limit: this.limit },
        'Storage memory has reached limit of @{limit} packages'
      );
      cb(new Error('Storage memory has reached limit of limit packages'));
    }
  }

  search(onPackage, onEnd, validateName) {
    // TODO: pending to implement
    onEnd();
  }

  remove(name, cb) {
    const list = this.data.list;

    const item = list.indexOf(name);

    if (item !== -1) {
      list.splice(item, 1);
    }

    cb(null);
  }

  get(cb) {
    cb(null, this.data.list);
  }

  sync() {
    // nothing to do
  }

  getPackageStorage(packageInfo) {
    // eslint-disable-next-line new-cap
    return new _memoryHandler2.default(packageInfo, this.data.files, this.logger);
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
}

exports.default = LocalMemory;
