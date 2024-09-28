'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const commons_api_1 = require('@verdaccio/commons-api');
const local_storage_1 = __importDefault(require('./local-storage'));

class VerdaccioStoragePlugin {
  config;
  version;
  logger;

  constructor(config, options) {
    this.config = config;
    this.logger = options.logger;
  }

  /**
   *
   */
  async getSecret() {
    return 'your secret';
  }

  async setSecret(secret) {
    return true;
  }

  /**
   * Add a new element.
   * @param {*} name
   * @return {Error|*}
   */
  add(name, callback) {
    callback((0, commons_api_1.getInternalError)('your own message here'));
  }

  /**
   * Perform a search in your registry
   * @param onPackage
   * @param onEnd
   * @param validateName
   */
  search(onPackage, onEnd, validateName) {
    onEnd();
    /**
     * Example of implementation:
     * try {
     *  someApi.getPackages((items) => {
     *   items.map(() => {
     *     if (validateName(item.name)) {
     *       onPackage(item);
     *     }
     *   });
     *  onEnd();
     * } catch(err) {
     *   onEnd(err);
     * }
     * });
     */
  }

  /**
   * Remove an element from the database.
   * @param {*} name
   * @return {Error|*}
   */
  remove(name, callback) {
    callback((0, commons_api_1.getInternalError)('your own message here'));
    /**
     * Example of implementation
     database.getPackage(name, (item, err) => {
     if (err) {
     callback(getInternalError('your own message here'));
     }

     // if all goes well we return nothing
     callback(null);
     }
     */
  }

  /**
   * Return all database elements.
   * @return {Array}
   */
  get(callback) {
    callback(null, [{ name: 'your-package' }]);
    /*
      Example of implementation
      database.getAll((allItems, err) => {
        callback(err, allItems);
      })
    */
  }

  /**
   * Create an instance of the `PackageStorage`
   * @param packageInfo
   */
  getPackageStorage(packageInfo) {
    return new local_storage_1.default(this.config, packageInfo, this.logger);
  }

  /**
   * All methods for npm token support
   * more info here https://github.com/verdaccio/verdaccio/pull/1427
   */
  saveToken(token) {
    throw new Error('Method not implemented.');
  }

  deleteToken(user, tokenKey) {
    throw new Error('Method not implemented.');
  }

  readTokens(filter) {
    throw new Error('Method not implemented.');
  }
}

exports.default = VerdaccioStoragePlugin;
