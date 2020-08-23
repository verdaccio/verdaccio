"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _async = _interopRequireDefault(require("async"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _level = _interopRequireDefault(require("level"));

var _lib = require("@verdaccio/commons-api/lib");

var _localFs = _interopRequireWildcard(require("./local-fs"));

var _pkgUtils = require("./pkg-utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEPRECATED_DB_NAME = '.sinopia-db.json';
const DB_NAME = '.verdaccio-db.json';
const TOKEN_DB_NAME = '.token-db';

/**
 * Handle local database.
 */
class LocalDatabase {
  /**
   * Load an parse the local json database.
   * @param {*} path the database path
   */
  constructor(config, logger) {
    _defineProperty(this, "path", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "locked", void 0);

    _defineProperty(this, "tokenDb", void 0);

    this.config = config;
    this.path = this._buildStoragePath(config);
    this.logger = logger;
    this.locked = false;
    this.data = this._fetchLocalPackages();
    this.logger.trace({
      config: this.config
    }, '[local-storage]: configuration: @{config}');

    this._sync();
  }

  getSecret() {
    return Promise.resolve(this.data.secret);
  }

  setSecret(secret) {
    return new Promise(resolve => {
      this.data.secret = secret;
      resolve(this._sync());
    });
  }
  /**
   * Add a new element.
   * @param {*} name
   * @return {Error|*}
   */


  add(name, cb) {
    if (this.data.list.indexOf(name) === -1) {
      this.data.list.push(name);
      this.logger.debug({
        name
      }, '[local-storage]: the private package @{name} has been added');
      cb(this._sync());
    } else {
      cb(null);
    }
  }

  search(onPackage, onEnd, validateName) {
    const storages = this._getCustomPackageLocalStorages();

    this.logger.trace(`local-storage: [search]: ${JSON.stringify(storages)}`);

    const base = _path.default.dirname(this.config.self_path);

    const self = this;
    const storageKeys = Object.keys(storages);
    this.logger.trace(`local-storage: [search] base: ${base} keys ${storageKeys}`);

    _async.default.eachSeries(storageKeys, function (storage, cb) {
      const position = storageKeys.indexOf(storage);

      const base2 = _path.default.join(position !== 0 ? storageKeys[0] : '');

      const storagePath = _path.default.resolve(base, base2, storage);

      self.logger.trace({
        storagePath,
        storage
      }, 'local-storage: [search] search path: @{storagePath} : @{storage}');

      _fs.default.readdir(storagePath, (err, files) => {
        if (err) {
          return cb(err);
        }

        _async.default.eachSeries(files, function (file, cb) {
          self.logger.trace({
            file
          }, 'local-storage: [search] search file path: @{file}');

          if (storageKeys.includes(file)) {
            return cb();
          }

          if (file.match(/^@/)) {
            // scoped
            const fileLocation = _path.default.resolve(base, storage, file);

            self.logger.trace({
              fileLocation
            }, 'local-storage: [search] search scoped file location: @{fileLocation}');

            _fs.default.readdir(fileLocation, function (err, files) {
              if (err) {
                return cb(err);
              }

              _async.default.eachSeries(files, (file2, cb) => {
                if (validateName(file2)) {
                  const packagePath = _path.default.resolve(base, storage, file, file2);

                  _fs.default.stat(packagePath, (err, stats) => {
                    if (_lodash.default.isNil(err) === false) {
                      return cb(err);
                    }

                    const item = {
                      name: `${file}/${file2}`,
                      path: packagePath,
                      time: stats.mtime.getTime()
                    };
                    onPackage(item, cb);
                  });
                } else {
                  cb();
                }
              }, cb);
            });
          } else if (validateName(file)) {
            const base2 = _path.default.join(position !== 0 ? storageKeys[0] : '');

            const packagePath = _path.default.resolve(base, base2, storage, file);

            self.logger.trace({
              packagePath
            }, 'local-storage: [search] search file location: @{packagePath}');

            _fs.default.stat(packagePath, (err, stats) => {
              if (_lodash.default.isNil(err) === false) {
                return cb(err);
              }

              onPackage({
                name: file,
                path: packagePath,
                time: self._getTime(stats.mtime.getTime(), stats.mtime)
              }, cb);
            });
          } else {
            cb();
          }
        }, cb);
      });
    }, onEnd);
  }
  /**
   * Remove an element from the database.
   * @param {*} name
   * @return {Error|*}
   */


  remove(name, cb) {
    this.get((err, data) => {
      if (err) {
        cb((0, _lib.getInternalError)('error remove private package'));
        this.logger.error({
          err
        }, '[local-storage/remove]: remove the private package has failed @{err}');
      }

      const pkgName = data.indexOf(name);

      if (pkgName !== -1) {
        this.data.list.splice(pkgName, 1);
        this.logger.trace({
          name
        }, 'local-storage: [remove] package @{name} has been removed');
      }

      cb(this._sync());
    });
  }
  /**
   * Return all database elements.
   * @return {Array}
   */


  get(cb) {
    const list = this.data.list;
    const totalItems = this.data.list.length;
    cb(null, list);
    this.logger.trace({
      totalItems
    }, 'local-storage: [get] full list of packages (@{totalItems}) has been fetched');
  }

  getPackageStorage(packageName) {
    const packageAccess = this.config.getMatchedPackagesSpec(packageName);

    const packagePath = this._getLocalStoragePath(packageAccess ? packageAccess.storage : undefined);

    this.logger.trace({
      packagePath
    }, '[local-storage/getPackageStorage]: storage selected: @{packagePath}');

    if (_lodash.default.isString(packagePath) === false) {
      this.logger.debug({
        name: packageName
      }, 'this package has no storage defined: @{name}');
      return;
    }

    const packageStoragePath = _path.default.join(_path.default.resolve(_path.default.dirname(this.config.self_path || ''), packagePath), packageName);

    this.logger.trace({
      packageStoragePath
    }, '[local-storage/getPackageStorage]: storage path: @{packageStoragePath}');
    return new _localFs.default(packageStoragePath, this.logger);
  }

  clean() {
    this._sync();
  }

  saveToken(token) {
    const key = this._getTokenKey(token);

    const db = this.getTokenDb();
    return new Promise((resolve, reject) => {
      db.put(key, token, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  deleteToken(user, tokenKey) {
    const key = this._compoundTokenKey(user, tokenKey);

    const db = this.getTokenDb();
    return new Promise((resolve, reject) => {
      db.del(key, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  readTokens(filter) {
    return new Promise((resolve, reject) => {
      const tokens = [];
      const key = filter.user + ':';
      const db = this.getTokenDb();
      const stream = db.createReadStream({
        gte: key,
        lte: String.fromCharCode(key.charCodeAt(0) + 1)
      });
      stream.on('data', data => {
        tokens.push(data.value);
      });
      stream.once('end', () => resolve(tokens));
      stream.once('error', err => reject(err));
    });
  }

  _getTime(time, mtime) {
    return time ? time : mtime;
  }

  _getCustomPackageLocalStorages() {
    const storages = {}; // add custom storage if exist

    if (this.config.storage) {
      storages[this.config.storage] = true;
    }

    const {
      packages
    } = this.config;

    if (packages) {
      const listPackagesConf = Object.keys(packages || {});
      listPackagesConf.map(pkg => {
        const storage = packages[pkg].storage;

        if (storage) {
          storages[storage] = false;
        }
      });
    }

    return storages;
  }
  /**
   * Syncronize {create} database whether does not exist.
   * @return {Error|*}
   */


  _sync() {
    this.logger.debug('[local-storage/_sync]: init sync database');

    if (this.locked) {
      this.logger.error('Database is locked, please check error message printed during startup to prevent data loss.');
      return new Error('Verdaccio database is locked, please contact your administrator to checkout logs during verdaccio startup.');
    } // Uses sync to prevent ugly race condition


    try {
      // https://www.npmjs.com/package/mkdirp#mkdirpsyncdir-opts
      const folderName = _path.default.dirname(this.path);

      _mkdirp.default.sync(folderName);

      this.logger.debug({
        folderName
      }, '[local-storage/_sync]: folder @{folderName} created succeed');
    } catch (err) {
      // perhaps a logger instance?
      this.logger.debug({
        err
      }, '[local-storage/_sync/mkdirp.sync]: sync failed @{err}');
      return null;
    }

    try {
      _fs.default.writeFileSync(this.path, JSON.stringify(this.data));

      this.logger.debug('[local-storage/_sync/writeFileSync]: sync write succeed');
      return null;
    } catch (err) {
      this.logger.debug({
        err
      }, '[local-storage/_sync/writeFileSync]: sync failed @{err}');
      return err;
    }
  }
  /**
   * Verify the right local storage location.
   * @param {String} path
   * @return {String}
   * @private
   */


  _getLocalStoragePath(storage) {
    const globalConfigStorage = this.config ? this.config.storage : undefined;

    if (_lodash.default.isNil(globalConfigStorage)) {
      throw new Error('global storage is required for this plugin');
    } else {
      if (_lodash.default.isNil(storage) === false && _lodash.default.isString(storage)) {
        return _path.default.join(globalConfigStorage, storage);
      }

      return globalConfigStorage;
    }
  }
  /**
   * Build the local database path.
   * @param {Object} config
   * @return {string|String|*}
   * @private
   */


  _buildStoragePath(config) {
    const sinopiadbPath = this._dbGenPath(DEPRECATED_DB_NAME, config);

    try {
      _fs.default.accessSync(sinopiadbPath, _fs.default.constants.F_OK);

      return sinopiadbPath;
    } catch (err) {
      if (err.code === _localFs.noSuchFile) {
        return this._dbGenPath(DB_NAME, config);
      }

      throw err;
    }
  }

  _dbGenPath(dbName, config) {
    return _path.default.join(_path.default.resolve(_path.default.dirname(config.self_path || ''), config.storage, dbName));
  }
  /**
   * Fetch local packages.
   * @private
   * @return {Object}
   */


  _fetchLocalPackages() {
    const list = [];
    const emptyDatabase = {
      list,
      secret: ''
    };

    try {
      const db = (0, _pkgUtils.loadPrivatePackages)(this.path, this.logger);
      return db;
    } catch (err) {
      // readFileSync is platform specific, macOS, Linux and Windows thrown an error
      // Only recreate if file not found to prevent data loss
      if (err.code !== _localFs.noSuchFile) {
        this.locked = true;
        this.logger.error('Failed to read package database file, please check the error printed below:\n', `File Path: ${this.path}\n\n ${err.message}`);
      }

      return emptyDatabase;
    }
  }

  getTokenDb() {
    if (!this.tokenDb) {
      this.tokenDb = (0, _level.default)(this._dbGenPath(TOKEN_DB_NAME, this.config), {
        valueEncoding: 'json'
      });
    }

    return this.tokenDb;
  }

  _getTokenKey(token) {
    const {
      user,
      key
    } = token;
    return this._compoundTokenKey(user, key);
  }

  _compoundTokenKey(user, key) {
    return `${user}:${key}`;
  }

}

var _default = LocalDatabase;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2NhbC1kYXRhYmFzZS50cyJdLCJuYW1lcyI6WyJERVBSRUNBVEVEX0RCX05BTUUiLCJEQl9OQU1FIiwiVE9LRU5fREJfTkFNRSIsIkxvY2FsRGF0YWJhc2UiLCJjb25zdHJ1Y3RvciIsImNvbmZpZyIsImxvZ2dlciIsInBhdGgiLCJfYnVpbGRTdG9yYWdlUGF0aCIsImxvY2tlZCIsImRhdGEiLCJfZmV0Y2hMb2NhbFBhY2thZ2VzIiwidHJhY2UiLCJfc3luYyIsImdldFNlY3JldCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2VjcmV0Iiwic2V0U2VjcmV0IiwiYWRkIiwibmFtZSIsImNiIiwibGlzdCIsImluZGV4T2YiLCJwdXNoIiwiZGVidWciLCJzZWFyY2giLCJvblBhY2thZ2UiLCJvbkVuZCIsInZhbGlkYXRlTmFtZSIsInN0b3JhZ2VzIiwiX2dldEN1c3RvbVBhY2thZ2VMb2NhbFN0b3JhZ2VzIiwiSlNPTiIsInN0cmluZ2lmeSIsImJhc2UiLCJQYXRoIiwiZGlybmFtZSIsInNlbGZfcGF0aCIsInNlbGYiLCJzdG9yYWdlS2V5cyIsIk9iamVjdCIsImtleXMiLCJhc3luYyIsImVhY2hTZXJpZXMiLCJzdG9yYWdlIiwicG9zaXRpb24iLCJiYXNlMiIsImpvaW4iLCJzdG9yYWdlUGF0aCIsImZzIiwicmVhZGRpciIsImVyciIsImZpbGVzIiwiZmlsZSIsImluY2x1ZGVzIiwibWF0Y2giLCJmaWxlTG9jYXRpb24iLCJmaWxlMiIsInBhY2thZ2VQYXRoIiwic3RhdCIsInN0YXRzIiwiXyIsImlzTmlsIiwiaXRlbSIsInRpbWUiLCJtdGltZSIsImdldFRpbWUiLCJfZ2V0VGltZSIsInJlbW92ZSIsImdldCIsImVycm9yIiwicGtnTmFtZSIsInNwbGljZSIsInRvdGFsSXRlbXMiLCJsZW5ndGgiLCJnZXRQYWNrYWdlU3RvcmFnZSIsInBhY2thZ2VOYW1lIiwicGFja2FnZUFjY2VzcyIsImdldE1hdGNoZWRQYWNrYWdlc1NwZWMiLCJfZ2V0TG9jYWxTdG9yYWdlUGF0aCIsInVuZGVmaW5lZCIsImlzU3RyaW5nIiwicGFja2FnZVN0b3JhZ2VQYXRoIiwiTG9jYWxEcml2ZXIiLCJjbGVhbiIsInNhdmVUb2tlbiIsInRva2VuIiwia2V5IiwiX2dldFRva2VuS2V5IiwiZGIiLCJnZXRUb2tlbkRiIiwicmVqZWN0IiwicHV0IiwiZGVsZXRlVG9rZW4iLCJ1c2VyIiwidG9rZW5LZXkiLCJfY29tcG91bmRUb2tlbktleSIsImRlbCIsInJlYWRUb2tlbnMiLCJmaWx0ZXIiLCJ0b2tlbnMiLCJzdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwiZ3RlIiwibHRlIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiY2hhckNvZGVBdCIsIm9uIiwidmFsdWUiLCJvbmNlIiwicGFja2FnZXMiLCJsaXN0UGFja2FnZXNDb25mIiwibWFwIiwicGtnIiwiRXJyb3IiLCJmb2xkZXJOYW1lIiwibWtkaXJwIiwic3luYyIsIndyaXRlRmlsZVN5bmMiLCJnbG9iYWxDb25maWdTdG9yYWdlIiwic2lub3BpYWRiUGF0aCIsIl9kYkdlblBhdGgiLCJhY2Nlc3NTeW5jIiwiY29uc3RhbnRzIiwiRl9PSyIsImNvZGUiLCJub1N1Y2hGaWxlIiwiZGJOYW1lIiwiZW1wdHlEYXRhYmFzZSIsIm1lc3NhZ2UiLCJ0b2tlbkRiIiwidmFsdWVFbmNvZGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOztBQUNBOztBQVlBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsa0JBQWtCLEdBQUcsa0JBQTNCO0FBQ0EsTUFBTUMsT0FBTyxHQUFHLG9CQUFoQjtBQUNBLE1BQU1DLGFBQWEsR0FBRyxXQUF0Qjs7QUFZQTs7O0FBR0EsTUFBTUMsYUFBTixDQUFrRDtBQVFoRDs7OztBQUlPQyxFQUFBQSxXQUFQLENBQW1CQyxNQUFuQixFQUFtQ0MsTUFBbkMsRUFBbUQ7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDakQsU0FB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VCxVQUFMLENBQWdCeEgsYUFBaEIsRUFBK0IsS0FBS0csTUFBcEMsQ0FBTixFQUFtRDtBQUNoRStILFFBQUFBLGFBQWEsRUFBRTtBQURpRCxPQUFuRCxDQUFmO0FBR0Q7O0FBRUQsV0FBTyxLQUFLRCxPQUFaO0FBQ0Q7O0FBRU8zQyxFQUFBQSxZQUFSLENBQXFCRixLQUFyQixFQUEyQztBQUN6QyxVQUFNO0FBQUVRLE1BQUFBLElBQUY7QUFBUVAsTUFBQUE7QUFBUixRQUFnQkQsS0FBdEI7QUFDQSxXQUFPLEtBQUtVLGlCQUFMLENBQXVCRixJQUF2QixFQUE2QlAsR0FBN0IsQ0FBUDtBQUNEOztBQUVPUyxFQUFBQSxpQkFBUixDQUEwQkYsSUFBMUIsRUFBd0NQLEdBQXhDLEVBQTZEO0FBQzNELFdBQVEsR0FBRU8sSUFBSyxJQUFHUCxHQUFJLEVBQXRCO0FBQ0Q7O0FBelorQzs7ZUE0Wm5DcEYsYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBzdHJlYW0gZnJvbSAnc3RyZWFtJztcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBhc3luYyBmcm9tICdhc3luYyc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQge1xuICBDYWxsYmFjayxcbiAgQ29uZmlnLFxuICBJUGFja2FnZVN0b3JhZ2UsXG4gIElQbHVnaW5TdG9yYWdlLFxuICBMb2NhbFN0b3JhZ2UsXG4gIExvZ2dlcixcbiAgU3RvcmFnZUxpc3QsXG4gIFRva2VuLFxuICBUb2tlbkZpbHRlcixcbn0gZnJvbSAnQHZlcmRhY2Npby90eXBlcyc7XG5pbXBvcnQgbGV2ZWwgZnJvbSAnbGV2ZWwnO1xuaW1wb3J0IHsgZ2V0SW50ZXJuYWxFcnJvciB9IGZyb20gJ0B2ZXJkYWNjaW8vY29tbW9ucy1hcGkvbGliJztcblxuaW1wb3J0IExvY2FsRHJpdmVyLCB7IG5vU3VjaEZpbGUgfSBmcm9tICcuL2xvY2FsLWZzJztcbmltcG9ydCB7IGxvYWRQcml2YXRlUGFja2FnZXMgfSBmcm9tICcuL3BrZy11dGlscyc7XG5cbmNvbnN0IERFUFJFQ0FURURfREJfTkFNRSA9ICcuc2lub3BpYS1kYi5qc29uJztcbmNvbnN0IERCX05BTUUgPSAnLnZlcmRhY2Npby1kYi5qc29uJztcbmNvbnN0IFRPS0VOX0RCX05BTUUgPSAnLnRva2VuLWRiJztcblxuaW50ZXJmYWNlIExldmVsIHtcbiAgcHV0KGtleTogc3RyaW5nLCB0b2tlbiwgZm4/OiBGdW5jdGlvbik6IHZvaWQ7XG5cbiAgZ2V0KGtleTogc3RyaW5nLCBmbj86IEZ1bmN0aW9uKTogdm9pZDtcblxuICBkZWwoa2V5OiBzdHJpbmcsIGZuPzogRnVuY3Rpb24pOiB2b2lkO1xuXG4gIGNyZWF0ZVJlYWRTdHJlYW0ob3B0aW9ucz86IG9iamVjdCk6IHN0cmVhbS5SZWFkYWJsZTtcbn1cblxuLyoqXG4gKiBIYW5kbGUgbG9jYWwgZGF0YWJhc2UuXG4gKi9cbmNsYXNzIExvY2FsRGF0YWJhc2UgaW1wbGVtZW50cyBJUGx1Z2luU3RvcmFnZTx7fT4ge1xuICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBkYXRhOiBMb2NhbFN0b3JhZ2U7XG4gIHB1YmxpYyBjb25maWc6IENvbmZpZztcbiAgcHVibGljIGxvY2tlZDogYm9vbGVhbjtcbiAgcHVibGljIHRva2VuRGI7XG5cbiAgLyoqXG4gICAqIExvYWQgYW4gcGFyc2UgdGhlIGxvY2FsIGpzb24gZGF0YWJhc2UuXG4gICAqIEBwYXJhbSB7Kn0gcGF0aCB0aGUgZGF0YWJhc2UgcGF0aFxuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnLCBsb2dnZXI6IExvZ2dlcikge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMucGF0aCA9IHRoaXMuX2J1aWxkU3RvcmFnZVBhdGgoY29uZmlnKTtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLmxvY2tlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuX2ZldGNoTG9jYWxQYWNrYWdlcygpO1xuXG4gICAgdGhpcy5sb2dnZXIudHJhY2UoeyBjb25maWc6IHRoaXMuY29uZmlnIH0sICdbbG9jYWwtc3RvcmFnZV06IGNvbmZpZ3VyYXRpb246IEB7Y29uZmlnfScpO1xuXG4gICAgdGhpcy5fc3luYygpO1xuICB9XG5cbiAgcHVibGljIGdldFNlY3JldCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5kYXRhLnNlY3JldCk7XG4gIH1cblxuICBwdWJsaWMgc2V0U2VjcmV0KHNlY3JldDogc3RyaW5nKTogUHJvbWlzZTxFcnJvciB8IG51bGw+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpOiB2b2lkID0+IHtcbiAgICAgIHRoaXMuZGF0YS5zZWNyZXQgPSBzZWNyZXQ7XG5cbiAgICAgIHJlc29sdmUodGhpcy5fc3luYygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZWxlbWVudC5cbiAgICogQHBhcmFtIHsqfSBuYW1lXG4gICAqIEByZXR1cm4ge0Vycm9yfCp9XG4gICAqL1xuICBwdWJsaWMgYWRkKG5hbWU6IHN0cmluZywgY2I6IENhbGxiYWNrKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF0YS5saXN0LmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICB0aGlzLmRhdGEubGlzdC5wdXNoKG5hbWUpO1xuXG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1Zyh7IG5hbWUgfSwgJ1tsb2NhbC1zdG9yYWdlXTogdGhlIHByaXZhdGUgcGFja2FnZSBAe25hbWV9IGhhcyBiZWVuIGFkZGVkJyk7XG4gICAgICBjYih0aGlzLl9zeW5jKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYihudWxsKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VhcmNoKG9uUGFja2FnZTogQ2FsbGJhY2ssIG9uRW5kOiBDYWxsYmFjaywgdmFsaWRhdGVOYW1lOiAobmFtZTogc3RyaW5nKSA9PiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3Qgc3RvcmFnZXMgPSB0aGlzLl9nZXRDdXN0b21QYWNrYWdlTG9jYWxTdG9yYWdlcygpO1xuICAgIHRoaXMubG9nZ2VyLnRyYWNlKGBsb2NhbC1zdG9yYWdlOiBbc2VhcmNoXTogJHtKU09OLnN0cmluZ2lmeShzdG9yYWdlcyl9YCk7XG4gICAgY29uc3QgYmFzZSA9IFBhdGguZGlybmFtZSh0aGlzLmNvbmZpZy5zZWxmX3BhdGgpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHN0b3JhZ2VLZXlzID0gT2JqZWN0LmtleXMoc3RvcmFnZXMpO1xuICAgIHRoaXMubG9nZ2VyLnRyYWNlKGBsb2NhbC1zdG9yYWdlOiBbc2VhcmNoXSBiYXNlOiAke2Jhc2V9IGtleXMgJHtzdG9yYWdlS2V5c31gKTtcblxuICAgIGFzeW5jLmVhY2hTZXJpZXMoXG4gICAgICBzdG9yYWdlS2V5cyxcbiAgICAgIGZ1bmN0aW9uKHN0b3JhZ2UsIGNiKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gc3RvcmFnZUtleXMuaW5kZXhPZihzdG9yYWdlKTtcbiAgICAgICAgY29uc3QgYmFzZTIgPSBQYXRoLmpvaW4ocG9zaXRpb24gIT09IDAgPyBzdG9yYWdlS2V5c1swXSA6ICcnKTtcbiAgICAgICAgY29uc3Qgc3RvcmFnZVBhdGg6IHN0cmluZyA9IFBhdGgucmVzb2x2ZShiYXNlLCBiYXNlMiwgc3RvcmFnZSk7XG4gICAgICAgIHNlbGYubG9nZ2VyLnRyYWNlKHsgc3RvcmFnZVBhdGgsIHN0b3JhZ2UgfSwgJ2xvY2FsLXN0b3JhZ2U6IFtzZWFyY2hdIHNlYXJjaCBwYXRoOiBAe3N0b3JhZ2VQYXRofSA6IEB7c3RvcmFnZX0nKTtcbiAgICAgICAgZnMucmVhZGRpcihzdG9yYWdlUGF0aCwgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhc3luYy5lYWNoU2VyaWVzKFxuICAgICAgICAgICAgZmlsZXMsXG4gICAgICAgICAgICBmdW5jdGlvbihmaWxlLCBjYikge1xuICAgICAgICAgICAgICBzZWxmLmxvZ2dlci50cmFjZSh7IGZpbGUgfSwgJ2xvY2FsLXN0b3JhZ2U6IFtzZWFyY2hdIHNlYXJjaCBmaWxlIHBhdGg6IEB7ZmlsZX0nKTtcbiAgICAgICAgICAgICAgaWYgKHN0b3JhZ2VLZXlzLmluY2x1ZGVzKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoZmlsZS5tYXRjaCgvXkAvKSkge1xuICAgICAgICAgICAgICAgIC8vIHNjb3BlZFxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVMb2NhdGlvbiA9IFBhdGgucmVzb2x2ZShiYXNlLCBzdG9yYWdlLCBmaWxlKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci50cmFjZShcbiAgICAgICAgICAgICAgICAgIHsgZmlsZUxvY2F0aW9uIH0sXG4gICAgICAgICAgICAgICAgICAnbG9jYWwtc3RvcmFnZTogW3NlYXJjaF0gc2VhcmNoIHNjb3BlZCBmaWxlIGxvY2F0aW9uOiBAe2ZpbGVMb2NhdGlvbn0nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBmcy5yZWFkZGlyKGZpbGVMb2NhdGlvbiwgZnVuY3Rpb24oZXJyLCBmaWxlcykge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgYXN5bmMuZWFjaFNlcmllcyhcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgIChmaWxlMiwgY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRhdGVOYW1lKGZpbGUyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFja2FnZVBhdGggPSBQYXRoLnJlc29sdmUoYmFzZSwgc3RvcmFnZSwgZmlsZSwgZmlsZTIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5zdGF0KHBhY2thZ2VQYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5pc05pbChlcnIpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYCR7ZmlsZX0vJHtmaWxlMn1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHBhY2thZ2VQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IHN0YXRzLm10aW1lLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25QYWNrYWdlKGl0ZW0sIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2JcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsaWRhdGVOYW1lKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZTIgPSBQYXRoLmpvaW4ocG9zaXRpb24gIT09IDAgPyBzdG9yYWdlS2V5c1swXSA6ICcnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlUGF0aCA9IFBhdGgucmVzb2x2ZShiYXNlLCBiYXNlMiwgc3RvcmFnZSwgZmlsZSk7XG4gICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIudHJhY2UoeyBwYWNrYWdlUGF0aCB9LCAnbG9jYWwtc3RvcmFnZTogW3NlYXJjaF0gc2VhcmNoIGZpbGUgbG9jYXRpb246IEB7cGFja2FnZVBhdGh9Jyk7XG4gICAgICAgICAgICAgICAgZnMuc3RhdChwYWNrYWdlUGF0aCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmlzTmlsKGVycikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgb25QYWNrYWdlKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwYWNrYWdlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBzZWxmLl9nZXRUaW1lKHN0YXRzLm10aW1lLmdldFRpbWUoKSwgc3RhdHMubXRpbWUpLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYlxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2JcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBvbkVuZFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVsZW1lbnQgZnJvbSB0aGUgZGF0YWJhc2UuXG4gICAqIEBwYXJhbSB7Kn0gbmFtZVxuICAgKiBAcmV0dXJuIHtFcnJvcnwqfVxuICAgKi9cbiAgcHVibGljIHJlbW92ZShuYW1lOiBzdHJpbmcsIGNiOiBDYWxsYmFjayk6IHZvaWQge1xuICAgIHRoaXMuZ2V0KChlcnIsIGRhdGEpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2IoZ2V0SW50ZXJuYWxFcnJvcignZXJyb3IgcmVtb3ZlIHByaXZhdGUgcGFja2FnZScpKTtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoeyBlcnIgfSwgJ1tsb2NhbC1zdG9yYWdlL3JlbW92ZV06IHJlbW92ZSB0aGUgcHJpdmF0ZSBwYWNrYWdlIGhhcyBmYWlsZWQgQHtlcnJ9Jyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBrZ05hbWUgPSBkYXRhLmluZGV4T2YobmFtZSk7XG4gICAgICBpZiAocGtnTmFtZSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5kYXRhLmxpc3Quc3BsaWNlKHBrZ05hbWUsIDEpO1xuXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKHsgbmFtZSB9LCAnbG9jYWwtc3RvcmFnZTogW3JlbW92ZV0gcGFja2FnZSBAe25hbWV9IGhhcyBiZWVuIHJlbW92ZWQnKTtcbiAgICAgIH1cblxuICAgICAgY2IodGhpcy5fc3luYygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYWxsIGRhdGFiYXNlIGVsZW1lbnRzLlxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIHB1YmxpYyBnZXQoY2I6IENhbGxiYWNrKTogdm9pZCB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZGF0YS5saXN0O1xuICAgIGNvbnN0IHRvdGFsSXRlbXMgPSB0aGlzLmRhdGEubGlzdC5sZW5ndGg7XG5cbiAgICBjYihudWxsLCBsaXN0KTtcblxuICAgIHRoaXMubG9nZ2VyLnRyYWNlKHsgdG90YWxJdGVtcyB9LCAnbG9jYWwtc3RvcmFnZTogW2dldF0gZnVsbCBsaXN0IG9mIHBhY2thZ2VzIChAe3RvdGFsSXRlbXN9KSBoYXMgYmVlbiBmZXRjaGVkJyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0UGFja2FnZVN0b3JhZ2UocGFja2FnZU5hbWU6IHN0cmluZyk6IElQYWNrYWdlU3RvcmFnZSB7XG4gICAgY29uc3QgcGFja2FnZUFjY2VzcyA9IHRoaXMuY29uZmlnLmdldE1hdGNoZWRQYWNrYWdlc1NwZWMocGFja2FnZU5hbWUpO1xuXG4gICAgY29uc3QgcGFja2FnZVBhdGg6IHN0cmluZyA9IHRoaXMuX2dldExvY2FsU3RvcmFnZVBhdGgocGFja2FnZUFjY2VzcyA/IHBhY2thZ2VBY2Nlc3Muc3RvcmFnZSA6IHVuZGVmaW5lZCk7XG4gICAgdGhpcy5sb2dnZXIudHJhY2UoeyBwYWNrYWdlUGF0aCB9LCAnW2xvY2FsLXN0b3JhZ2UvZ2V0UGFja2FnZVN0b3JhZ2VdOiBzdG9yYWdlIHNlbGVjdGVkOiBAe3BhY2thZ2VQYXRofScpO1xuXG4gICAgaWYgKF8uaXNTdHJpbmcocGFja2FnZVBhdGgpID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoeyBuYW1lOiBwYWNrYWdlTmFtZSB9LCAndGhpcyBwYWNrYWdlIGhhcyBubyBzdG9yYWdlIGRlZmluZWQ6IEB7bmFtZX0nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYWNrYWdlU3RvcmFnZVBhdGg6IHN0cmluZyA9IFBhdGguam9pbihcbiAgICAgIFBhdGgucmVzb2x2ZShQYXRoLmRpcm5hbWUodGhpcy5jb25maWcuc2VsZl9wYXRoIHx8ICcnKSwgcGFja2FnZVBhdGgpLFxuICAgICAgcGFja2FnZU5hbWVcbiAgICApO1xuXG4gICAgdGhpcy5sb2dnZXIudHJhY2UoeyBwYWNrYWdlU3RvcmFnZVBhdGggfSwgJ1tsb2NhbC1zdG9yYWdlL2dldFBhY2thZ2VTdG9yYWdlXTogc3RvcmFnZSBwYXRoOiBAe3BhY2thZ2VTdG9yYWdlUGF0aH0nKTtcblxuICAgIHJldHVybiBuZXcgTG9jYWxEcml2ZXIocGFja2FnZVN0b3JhZ2VQYXRoLCB0aGlzLmxvZ2dlcik7XG4gIH1cblxuICBwdWJsaWMgY2xlYW4oKTogdm9pZCB7XG4gICAgdGhpcy5fc3luYygpO1xuICB9XG5cbiAgcHVibGljIHNhdmVUb2tlbih0b2tlbjogVG9rZW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLl9nZXRUb2tlbktleSh0b2tlbik7XG4gICAgY29uc3QgZGIgPSB0aGlzLmdldFRva2VuRGIoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KTogdm9pZCA9PiB7XG4gICAgICBkYi5wdXQoa2V5LCB0b2tlbiwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBkZWxldGVUb2tlbih1c2VyOiBzdHJpbmcsIHRva2VuS2V5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLl9jb21wb3VuZFRva2VuS2V5KHVzZXIsIHRva2VuS2V5KTtcbiAgICBjb25zdCBkYiA9IHRoaXMuZ2V0VG9rZW5EYigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KTogdm9pZCA9PiB7XG4gICAgICBkYi5kZWwoa2V5LCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlYWRUb2tlbnMoZmlsdGVyOiBUb2tlbkZpbHRlcik6IFByb21pc2U8VG9rZW5bXT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0b2tlbnM6IFRva2VuW10gPSBbXTtcbiAgICAgIGNvbnN0IGtleSA9IGZpbHRlci51c2VyICsgJzonO1xuICAgICAgY29uc3QgZGIgPSB0aGlzLmdldFRva2VuRGIoKTtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGRiLmNyZWF0ZVJlYWRTdHJlYW0oe1xuICAgICAgICBndGU6IGtleSxcbiAgICAgICAgbHRlOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGtleS5jaGFyQ29kZUF0KDApICsgMSksXG4gICAgICB9KTtcblxuICAgICAgc3RyZWFtLm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgIHRva2Vucy5wdXNoKGRhdGEudmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICAgIHN0cmVhbS5vbmNlKCdlbmQnLCAoKSA9PiByZXNvbHZlKHRva2VucykpO1xuXG4gICAgICBzdHJlYW0ub25jZSgnZXJyb3InLCBlcnIgPT4gcmVqZWN0KGVycikpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0VGltZSh0aW1lOiBudW1iZXIsIG10aW1lOiBEYXRlKTogbnVtYmVyIHwgRGF0ZSB7XG4gICAgcmV0dXJuIHRpbWUgPyB0aW1lIDogbXRpbWU7XG4gIH1cblxuICBwcml2YXRlIF9nZXRDdXN0b21QYWNrYWdlTG9jYWxTdG9yYWdlcygpOiBvYmplY3Qge1xuICAgIGNvbnN0IHN0b3JhZ2VzID0ge307XG5cbiAgICAvLyBhZGQgY3VzdG9tIHN0b3JhZ2UgaWYgZXhpc3RcbiAgICBpZiAodGhpcy5jb25maWcuc3RvcmFnZSkge1xuICAgICAgc3RvcmFnZXNbdGhpcy5jb25maWcuc3RvcmFnZV0gPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHsgcGFja2FnZXMgfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgaWYgKHBhY2thZ2VzKSB7XG4gICAgICBjb25zdCBsaXN0UGFja2FnZXNDb25mID0gT2JqZWN0LmtleXMocGFja2FnZXMgfHwge30pO1xuXG4gICAgICBsaXN0UGFja2FnZXNDb25mLm1hcChwa2cgPT4ge1xuICAgICAgICBjb25zdCBzdG9yYWdlID0gcGFja2FnZXNbcGtnXS5zdG9yYWdlO1xuICAgICAgICBpZiAoc3RvcmFnZSkge1xuICAgICAgICAgIHN0b3JhZ2VzW3N0b3JhZ2VdID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzdG9yYWdlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jcm9uaXplIHtjcmVhdGV9IGRhdGFiYXNlIHdoZXRoZXIgZG9lcyBub3QgZXhpc3QuXG4gICAqIEByZXR1cm4ge0Vycm9yfCp9XG4gICAqL1xuICBwcml2YXRlIF9zeW5jKCk6IEVycm9yIHwgbnVsbCB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ1tsb2NhbC1zdG9yYWdlL19zeW5jXTogaW5pdCBzeW5jIGRhdGFiYXNlJyk7XG5cbiAgICBpZiAodGhpcy5sb2NrZWQpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdEYXRhYmFzZSBpcyBsb2NrZWQsIHBsZWFzZSBjaGVjayBlcnJvciBtZXNzYWdlIHByaW50ZWQgZHVyaW5nIHN0YXJ0dXAgdG8gcHJldmVudCBkYXRhIGxvc3MuJyk7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgICAgICAnVmVyZGFjY2lvIGRhdGFiYXNlIGlzIGxvY2tlZCwgcGxlYXNlIGNvbnRhY3QgeW91ciBhZG1pbmlzdHJhdG9yIHRvIGNoZWNrb3V0IGxvZ3MgZHVyaW5nIHZlcmRhY2NpbyBzdGFydHVwLidcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIFVzZXMgc3luYyB0byBwcmV2ZW50IHVnbHkgcmFjZSBjb25kaXRpb25cbiAgICB0cnkge1xuICAgICAgLy8gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvbWtkaXJwI21rZGlycHN5bmNkaXItb3B0c1xuICAgICAgY29uc3QgZm9sZGVyTmFtZSA9IFBhdGguZGlybmFtZSh0aGlzLnBhdGgpO1xuICAgICAgbWtkaXJwLnN5bmMoZm9sZGVyTmFtZSk7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1Zyh7IGZvbGRlck5hbWUgfSwgJ1tsb2NhbC1zdG9yYWdlL19zeW5jXTogZm9sZGVyIEB7Zm9sZGVyTmFtZX0gY3JlYXRlZCBzdWNjZWVkJyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBwZXJoYXBzIGEgbG9nZ2VyIGluc3RhbmNlP1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoeyBlcnIgfSwgJ1tsb2NhbC1zdG9yYWdlL19zeW5jL21rZGlycC5zeW5jXTogc3luYyBmYWlsZWQgQHtlcnJ9Jyk7XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHRoaXMucGF0aCwgSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhKSk7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnW2xvY2FsLXN0b3JhZ2UvX3N5bmMvd3JpdGVGaWxlU3luY106IHN5bmMgd3JpdGUgc3VjY2VlZCcpO1xuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKHsgZXJyIH0sICdbbG9jYWwtc3RvcmFnZS9fc3luYy93cml0ZUZpbGVTeW5jXTogc3luYyBmYWlsZWQgQHtlcnJ9Jyk7XG5cbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmeSB0aGUgcmlnaHQgbG9jYWwgc3RvcmFnZSBsb2NhdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0TG9jYWxTdG9yYWdlUGF0aChzdG9yYWdlOiBzdHJpbmcgfCB2b2lkKTogc3RyaW5nIHtcbiAgICBjb25zdCBnbG9iYWxDb25maWdTdG9yYWdlID0gdGhpcy5jb25maWcgPyB0aGlzLmNvbmZpZy5zdG9yYWdlIDogdW5kZWZpbmVkO1xuICAgIGlmIChfLmlzTmlsKGdsb2JhbENvbmZpZ1N0b3JhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dsb2JhbCBzdG9yYWdlIGlzIHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoXy5pc05pbChzdG9yYWdlKSA9PT0gZmFsc2UgJiYgXy5pc1N0cmluZyhzdG9yYWdlKSkge1xuICAgICAgICByZXR1cm4gUGF0aC5qb2luKGdsb2JhbENvbmZpZ1N0b3JhZ2UgYXMgc3RyaW5nLCBzdG9yYWdlIGFzIHN0cmluZyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBnbG9iYWxDb25maWdTdG9yYWdlIGFzIHN0cmluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgdGhlIGxvY2FsIGRhdGFiYXNlIHBhdGguXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAgICogQHJldHVybiB7c3RyaW5nfFN0cmluZ3wqfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBfYnVpbGRTdG9yYWdlUGF0aChjb25maWc6IENvbmZpZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2lub3BpYWRiUGF0aDogc3RyaW5nID0gdGhpcy5fZGJHZW5QYXRoKERFUFJFQ0FURURfREJfTkFNRSwgY29uZmlnKTtcbiAgICB0cnkge1xuICAgICAgZnMuYWNjZXNzU3luYyhzaW5vcGlhZGJQYXRoLCBmcy5jb25zdGFudHMuRl9PSyk7XG4gICAgICByZXR1cm4gc2lub3BpYWRiUGF0aDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIuY29kZSA9PT0gbm9TdWNoRmlsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGJHZW5QYXRoKERCX05BTUUsIGNvbmZpZyk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9kYkdlblBhdGgoZGJOYW1lOiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKTogc3RyaW5nIHtcbiAgICByZXR1cm4gUGF0aC5qb2luKFBhdGgucmVzb2x2ZShQYXRoLmRpcm5hbWUoY29uZmlnLnNlbGZfcGF0aCB8fCAnJyksIGNvbmZpZy5zdG9yYWdlIGFzIHN0cmluZywgZGJOYW1lKSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggbG9jYWwgcGFja2FnZXMuXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIHByaXZhdGUgX2ZldGNoTG9jYWxQYWNrYWdlcygpOiBMb2NhbFN0b3JhZ2Uge1xuICAgIGNvbnN0IGxpc3Q6IFN0b3JhZ2VMaXN0ID0gW107XG4gICAgY29uc3QgZW1wdHlEYXRhYmFzZSA9IHsgbGlzdCwgc2VjcmV0OiAnJyB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRiID0gbG9hZFByaXZhdGVQYWNrYWdlcyh0aGlzLnBhdGgsIHRoaXMubG9nZ2VyKTtcblxuICAgICAgcmV0dXJuIGRiO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gcmVhZEZpbGVTeW5jIGlzIHBsYXRmb3JtIHNwZWNpZmljLCBtYWNPUywgTGludXggYW5kIFdpbmRvd3MgdGhyb3duIGFuIGVycm9yXG4gICAgICAvLyBPbmx5IHJlY3JlYXRlIGlmIGZpbGUgbm90IGZvdW5kIHRvIHByZXZlbnQgZGF0YSBsb3NzXG4gICAgICBpZiAoZXJyLmNvZGUgIT09IG5vU3VjaEZpbGUpIHtcbiAgICAgICAgdGhpcy5sb2NrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcbiAgICAgICAgICAnRmFpbGVkIHRvIHJlYWQgcGFja2FnZSBkYXRhYmFzZSBmaWxlLCBwbGVhc2UgY2hlY2sgdGhlIGVycm9yIHByaW50ZWQgYmVsb3c6XFxuJyxcbiAgICAgICAgICBgRmlsZSBQYXRoOiAke3RoaXMucGF0aH1cXG5cXG4gJHtlcnIubWVzc2FnZX1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbXB0eURhdGFiYXNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9rZW5EYigpOiBMZXZlbCB7XG4gICAgaWYgKCF0aGlzLnRva2VuRGIpIHtcbiAgICAgIHRoaXMudG9rZW5EYiA9IGxldmVsKHRoaXMuX2RiR2VuUGF0aChUT0tFTl9EQl9OQU1FLCB0aGlzLmNvbmZpZyksIHtcbiAgICAgICAgdmFsdWVFbmNvZGluZzogJ2pzb24nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudG9rZW5EYjtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFRva2VuS2V5KHRva2VuOiBUb2tlbik6IHN0cmluZyB7XG4gICAgY29uc3QgeyB1c2VyLCBrZXkgfSA9IHRva2VuO1xuICAgIHJldHVybiB0aGlzLl9jb21wb3VuZFRva2VuS2V5KHVzZXIsIGtleSk7XG4gIH1cblxuICBwcml2YXRlIF9jb21wb3VuZFRva2VuS2V5KHVzZXI6IHN0cmluZywga2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt1c2VyfToke2tleX1gO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvY2FsRGF0YWJhc2U7XG4iXX0=