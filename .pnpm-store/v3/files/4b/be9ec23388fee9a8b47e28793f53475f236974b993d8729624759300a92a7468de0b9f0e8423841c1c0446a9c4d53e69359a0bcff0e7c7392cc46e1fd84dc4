"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _assert = _interopRequireDefault(require("assert"));

var _cryptoUtils = require("./crypto-utils");

var _configUtils = require("./config-utils");

var _utils = require("./utils");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const LoggerApi = require('./logger');

const strategicConfigProps = ['uplinks', 'packages'];
const allowedEnvConfig = ['http_proxy', 'https_proxy', 'no_proxy'];
/**
 * Coordinates the application configuration
 */

class Config {
  // @ts-ignore
  // @ts-ignore
  constructor(config) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "user_agent", void 0);

    _defineProperty(this, "secret", void 0);

    _defineProperty(this, "uplinks", void 0);

    _defineProperty(this, "packages", void 0);

    _defineProperty(this, "users", void 0);

    _defineProperty(this, "server_id", void 0);

    _defineProperty(this, "self_path", void 0);

    _defineProperty(this, "storage", void 0);

    _defineProperty(this, "plugins", void 0);

    _defineProperty(this, "security", void 0);

    const self = this;
    this.logger = LoggerApi.logger;
    this.self_path = config.self_path;
    this.storage = config.storage;
    this.plugins = config.plugins;

    for (const configProp in config) {
      if (self[configProp] == null) {
        self[configProp] = config[configProp];
      }
    } // @ts-ignore


    if (_lodash.default.isNil(this.user_agent)) {
      this.user_agent = (0, _utils.getUserAgent)();
    } // some weird shell scripts are valid yaml files parsed as string


    (0, _assert.default)(_lodash.default.isObject(config), _constants.APP_ERROR.CONFIG_NOT_VALID); // sanity check for strategic config properties

    strategicConfigProps.forEach(function (x) {
      if (self[x] == null) {
        self[x] = {};
      }

      (0, _assert.default)((0, _utils.isObject)(self[x]), `CONFIG: bad "${x}" value (object expected)`);
    });
    this.uplinks = (0, _configUtils.sanityCheckUplinksProps)((0, _configUtils.uplinkSanityCheck)(this.uplinks));

    if (_lodash.default.isNil(this.users) === false) {
      this.logger.warn(`[users]: property on configuration file
      is not longer supported, property being ignored`);
    }

    this.packages = (0, _configUtils.normalisePackageAccess)(self.packages); // loading these from ENV if aren't in config

    allowedEnvConfig.forEach(envConf => {
      if (!(envConf in self)) {
        self[envConf] = process.env[envConf] || process.env[envConf.toUpperCase()];
      }
    }); // unique identifier of self server (or a cluster), used to avoid loops
    // @ts-ignore

    if (!this.server_id) {
      this.server_id = (0, _cryptoUtils.generateRandomHexString)(6);
    }
  }
  /**
   * Check for package spec
   */


  getMatchedPackagesSpec(pkgName) {
    return (0, _configUtils.getMatchedPackagesSpec)(pkgName, this.packages);
  }
  /**
   * Store or create whether receive a secret key
   */


  checkSecretKey(secret) {
    if (_lodash.default.isString(secret) && _lodash.default.isEmpty(secret) === false) {
      this.secret = secret;
      return secret;
    } // it generates a secret key
    // FUTURE: this might be an external secret key, perhaps within config file?


    this.secret = (0, _cryptoUtils.generateRandomHexString)(32);
    return this.secret;
  }

}

var _default = Config;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY29uZmlnLnRzIl0sIm5hbWVzIjpbIkxvZ2dlckFwaSIsInJlcXVpcmUiLCJzdHJhdGVnaWNDb25maWdQcm9wcyIsImFsbG93ZWRFbnZDb25maWciLCJDb25maWciLCJjb25zdHJ1Y3RvciIsImNvbmZpZyIsInNlbGYiLCJsb2dnZXIiLCJzZWxmX3BhdGgiLCJzdG9yYWdlIiwicGx1Z2lucyIsImNvbmZpZ1Byb3AiLCJfIiwiaXNOaWwiLCJ1c2VyX2FnZW50IiwiaXNPYmplY3QiLCJBUFBfRVJST1IiLCJDT05GSUdfTk9UX1ZBTElEIiwiZm9yRWFjaCIsIngiLCJ1cGxpbmtzIiwidXNlcnMiLCJ3YXJuIiwicGFja2FnZXMiLCJlbnZDb25mIiwicHJvY2VzcyIsImVudiIsInRvVXBwZXJDYXNlIiwic2VydmVyX2lkIiwiZ2V0TWF0Y2hlZFBhY2thZ2VzU3BlYyIsInBrZ05hbWUiLCJjaGVja1NlY3JldEtleSIsInNlY3JldCIsImlzU3RyaW5nIiwiaXNFbXB0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFNQSxNQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxVQUFELENBQXpCOztBQUNBLE1BQU1DLG9CQUFvQixHQUFHLENBQUMsU0FBRCxFQUFZLFVBQVosQ0FBN0I7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyxDQUFDLFlBQUQsRUFBZSxhQUFmLEVBQThCLFVBQTlCLENBQXpCO0FBRUE7Ozs7QUFHQSxNQUFNQyxNQUFOLENBQWtDO0FBR2hDO0FBU0E7QUFHT0MsRUFBQUEsV0FBUCxDQUFtQkMsTUFBbkIsRUFBMEM7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDeEMsVUFBTUMsSUFBSSxHQUFHLElBQWI7QUFDQSxTQUFLQyxNQUFMLEdBQWNSLFNBQVMsQ0FBQ1EsTUFBeEI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCSCxNQUFNLENBQUNHLFNBQXhCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlSixNQUFNLENBQUNJLE9BQXRCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlTCxNQUFNLENBQUNLLE9BQXRCOztBQUVBLFNBQUssTUFBTUMsVUFBWCxJQUF5Qk4sTUFBekIsRUFBaUM7QUFDL0IsVUFBSUMsSUFBSSxDQUFDSyxVQUFELENBQUosSUFBb0IsSUFBeEIsRUFBOEI7QUFDNUJMLFFBQUFBLElBQUksQ0FBQ0ssVUFBRCxDQUFKLEdBQW1CTixNQUFNLENBQUNNLFVBQUQsQ0FBekI7QUFDRDtBQUNGLEtBWHVDLENBYXhDOzs7QUFDQSxRQUFJQyxnQkFBRUMsS0FBRixDQUFRLEtBQUtDLFVBQWIsQ0FBSixFQUE4QjtBQUM1QixXQUFLQSxVQUFMLEdBQWtCLDBCQUFsQjtBQUNELEtBaEJ1QyxDQWtCeEM7OztBQUNBLHlCQUFPRixnQkFBRUcsUUFBRixDQUFXVixNQUFYLENBQVAsRUFBMkJXLHFCQUFVQyxnQkFBckMsRUFuQndDLENBcUJ4Qzs7QUFDQWhCLElBQUFBLG9CQUFvQixDQUFDaUIsT0FBckIsQ0FBNkIsVUFBU0MsQ0FBVCxFQUFrQjtBQUM3QyxVQUFJYixJQUFJLENBQUNhLENBQUQsQ0FBSixJQUFXLElBQWYsRUFBcUI7QUFDbkJiLFFBQUFBLElBQUksQ0FBQ2EsQ0FBRCxDQUFKLEdBQVUsRUFBVjtBQUNEOztBQUVELDJCQUFPLHFCQUFTYixJQUFJLENBQUNhLENBQUQsQ0FBYixDQUFQLEVBQTJCLGdCQUFlQSxDQUFFLDJCQUE1QztBQUNELEtBTkQ7QUFRQSxTQUFLQyxPQUFMLEdBQWUsMENBQXdCLG9DQUFrQixLQUFLQSxPQUF2QixDQUF4QixDQUFmOztBQUVBLFFBQUlSLGdCQUFFQyxLQUFGLENBQVEsS0FBS1EsS0FBYixNQUF3QixLQUE1QixFQUFtQztBQUNqQyxXQUFLZCxNQUFMLENBQVllLElBQVosQ0FBa0I7c0RBQWxCO0FBRUQ7O0FBRUQsU0FBS0MsUUFBTCxHQUFnQix5Q0FBdUJqQixJQUFJLENBQUNpQixRQUE1QixDQUFoQixDQXJDd0MsQ0F1Q3hDOztBQUNBckIsSUFBQUEsZ0JBQWdCLENBQUNnQixPQUFqQixDQUNHTSxPQUFELElBQW1CO0FBQ2pCLFVBQUksRUFBRUEsT0FBTyxJQUFJbEIsSUFBYixDQUFKLEVBQXdCO0FBQ3RCQSxRQUFBQSxJQUFJLENBQUNrQixPQUFELENBQUosR0FBZ0JDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixPQUFaLEtBQXdCQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsT0FBTyxDQUFDRyxXQUFSLEVBQVosQ0FBeEM7QUFDRDtBQUNGLEtBTEgsRUF4Q3dDLENBZ0R4QztBQUNBOztBQUNBLFFBQUksQ0FBQyxLQUFLQyxTQUFWLEVBQXFCO0FBQ25CLFdBQUtBLFNBQUwsR0FBaUIsMENBQXdCLENBQXhCLENBQWpCO0FBQ0Q7QUFDRjtBQUVEOzs7OztBQUdPQyxFQUFBQSxzQkFBUCxDQUE4QkMsT0FBOUIsRUFBK0Q7QUFDN0QsV0FBTyx5Q0FBdUJBLE9BQXZCLEVBQWdDLEtBQUtQLFFBQXJDLENBQVA7QUFDRDtBQUVEOzs7OztBQUdPUSxFQUFBQSxjQUFQLENBQXNCQyxNQUF0QixFQUE4QztBQUM1QyxRQUFJcEIsZ0JBQUVxQixRQUFGLENBQVdELE1BQVgsS0FBc0JwQixnQkFBRXNCLE9BQUYsQ0FBVUYsTUFBVixNQUFzQixLQUFoRCxFQUF1RDtBQUNyRCxXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxhQUFPQSxNQUFQO0FBQ0QsS0FKMkMsQ0FLNUM7QUFDQTs7O0FBQ0EsU0FBS0EsTUFBTCxHQUFjLDBDQUF3QixFQUF4QixDQUFkO0FBQ0EsV0FBTyxLQUFLQSxNQUFaO0FBQ0Q7O0FBekYrQjs7ZUE0Rm5CN0IsTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmltcG9ydCB7IGdlbmVyYXRlUmFuZG9tSGV4U3RyaW5nIH0gZnJvbSAnLi9jcnlwdG8tdXRpbHMnO1xuaW1wb3J0IHsgZ2V0TWF0Y2hlZFBhY2thZ2VzU3BlYywgbm9ybWFsaXNlUGFja2FnZUFjY2Vzcywgc2FuaXR5Q2hlY2tVcGxpbmtzUHJvcHMsIHVwbGlua1Nhbml0eUNoZWNrIH0gZnJvbSAnLi9jb25maWctdXRpbHMnO1xuaW1wb3J0IHsgZ2V0VXNlckFnZW50LCBpc09iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQVBQX0VSUk9SIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBQYWNrYWdlTGlzdCwgQ29uZmlnIGFzIEFwcENvbmZpZywgU2VjdXJpdHksIExvZ2dlciB9IGZyb20gJ0B2ZXJkYWNjaW8vdHlwZXMnO1xuXG5pbXBvcnQgeyBNYXRjaGVkUGFja2FnZSwgU3RhcnRVcENvbmZpZyB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuY29uc3QgTG9nZ2VyQXBpID0gcmVxdWlyZSgnLi9sb2dnZXInKTtcbmNvbnN0IHN0cmF0ZWdpY0NvbmZpZ1Byb3BzID0gWyd1cGxpbmtzJywgJ3BhY2thZ2VzJ107XG5jb25zdCBhbGxvd2VkRW52Q29uZmlnID0gWydodHRwX3Byb3h5JywgJ2h0dHBzX3Byb3h5JywgJ25vX3Byb3h5J107XG5cbi8qKlxuICogQ29vcmRpbmF0ZXMgdGhlIGFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb25cbiAqL1xuY2xhc3MgQ29uZmlnIGltcGxlbWVudHMgQXBwQ29uZmlnIHtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwdWJsaWMgdXNlcl9hZ2VudDogc3RyaW5nO1xuICAvLyBAdHMtaWdub3JlXG4gIHB1YmxpYyBzZWNyZXQ6IHN0cmluZztcbiAgcHVibGljIHVwbGlua3M6IGFueTtcbiAgcHVibGljIHBhY2thZ2VzOiBQYWNrYWdlTGlzdDtcbiAgcHVibGljIHVzZXJzOiBhbnk7XG4gIHB1YmxpYyBzZXJ2ZXJfaWQ6IHN0cmluZztcbiAgcHVibGljIHNlbGZfcGF0aDogc3RyaW5nO1xuICBwdWJsaWMgc3RvcmFnZTogc3RyaW5nIHwgdm9pZDtcbiAgcHVibGljIHBsdWdpbnM6IHN0cmluZyB8IHZvaWQ7XG4gIC8vIEB0cy1pZ25vcmVcbiAgcHVibGljIHNlY3VyaXR5OiBTZWN1cml0eTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoY29uZmlnOiBTdGFydFVwQ29uZmlnKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5sb2dnZXIgPSBMb2dnZXJBcGkubG9nZ2VyO1xuICAgIHRoaXMuc2VsZl9wYXRoID0gY29uZmlnLnNlbGZfcGF0aDtcbiAgICB0aGlzLnN0b3JhZ2UgPSBjb25maWcuc3RvcmFnZTtcbiAgICB0aGlzLnBsdWdpbnMgPSBjb25maWcucGx1Z2lucztcblxuICAgIGZvciAoY29uc3QgY29uZmlnUHJvcCBpbiBjb25maWcpIHtcbiAgICAgIGlmIChzZWxmW2NvbmZpZ1Byb3BdID09IG51bGwpIHtcbiAgICAgICAgc2VsZltjb25maWdQcm9wXSA9IGNvbmZpZ1tjb25maWdQcm9wXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKF8uaXNOaWwodGhpcy51c2VyX2FnZW50KSkge1xuICAgICAgdGhpcy51c2VyX2FnZW50ID0gZ2V0VXNlckFnZW50KCk7XG4gICAgfVxuXG4gICAgLy8gc29tZSB3ZWlyZCBzaGVsbCBzY3JpcHRzIGFyZSB2YWxpZCB5YW1sIGZpbGVzIHBhcnNlZCBhcyBzdHJpbmdcbiAgICBhc3NlcnQoXy5pc09iamVjdChjb25maWcpLCBBUFBfRVJST1IuQ09ORklHX05PVF9WQUxJRCk7XG5cbiAgICAvLyBzYW5pdHkgY2hlY2sgZm9yIHN0cmF0ZWdpYyBjb25maWcgcHJvcGVydGllc1xuICAgIHN0cmF0ZWdpY0NvbmZpZ1Byb3BzLmZvckVhY2goZnVuY3Rpb24oeCk6IHZvaWQge1xuICAgICAgaWYgKHNlbGZbeF0gPT0gbnVsbCkge1xuICAgICAgICBzZWxmW3hdID0ge307XG4gICAgICB9XG5cbiAgICAgIGFzc2VydChpc09iamVjdChzZWxmW3hdKSwgYENPTkZJRzogYmFkIFwiJHt4fVwiIHZhbHVlIChvYmplY3QgZXhwZWN0ZWQpYCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnVwbGlua3MgPSBzYW5pdHlDaGVja1VwbGlua3NQcm9wcyh1cGxpbmtTYW5pdHlDaGVjayh0aGlzLnVwbGlua3MpKTtcblxuICAgIGlmIChfLmlzTmlsKHRoaXMudXNlcnMpID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5sb2dnZXIud2FybihgW3VzZXJzXTogcHJvcGVydHkgb24gY29uZmlndXJhdGlvbiBmaWxlXG4gICAgICBpcyBub3QgbG9uZ2VyIHN1cHBvcnRlZCwgcHJvcGVydHkgYmVpbmcgaWdub3JlZGApO1xuICAgIH1cblxuICAgIHRoaXMucGFja2FnZXMgPSBub3JtYWxpc2VQYWNrYWdlQWNjZXNzKHNlbGYucGFja2FnZXMpO1xuXG4gICAgLy8gbG9hZGluZyB0aGVzZSBmcm9tIEVOViBpZiBhcmVuJ3QgaW4gY29uZmlnXG4gICAgYWxsb3dlZEVudkNvbmZpZy5mb3JFYWNoKFxuICAgICAgKGVudkNvbmYpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCEoZW52Q29uZiBpbiBzZWxmKSkge1xuICAgICAgICAgIHNlbGZbZW52Q29uZl0gPSBwcm9jZXNzLmVudltlbnZDb25mXSB8fCBwcm9jZXNzLmVudltlbnZDb25mLnRvVXBwZXJDYXNlKCldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHNlbGYgc2VydmVyIChvciBhIGNsdXN0ZXIpLCB1c2VkIHRvIGF2b2lkIGxvb3BzXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICghdGhpcy5zZXJ2ZXJfaWQpIHtcbiAgICAgIHRoaXMuc2VydmVyX2lkID0gZ2VuZXJhdGVSYW5kb21IZXhTdHJpbmcoNik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBwYWNrYWdlIHNwZWNcbiAgICovXG4gIHB1YmxpYyBnZXRNYXRjaGVkUGFja2FnZXNTcGVjKHBrZ05hbWU6IHN0cmluZyk6IE1hdGNoZWRQYWNrYWdlIHtcbiAgICByZXR1cm4gZ2V0TWF0Y2hlZFBhY2thZ2VzU3BlYyhwa2dOYW1lLCB0aGlzLnBhY2thZ2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSBvciBjcmVhdGUgd2hldGhlciByZWNlaXZlIGEgc2VjcmV0IGtleVxuICAgKi9cbiAgcHVibGljIGNoZWNrU2VjcmV0S2V5KHNlY3JldDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoXy5pc1N0cmluZyhzZWNyZXQpICYmIF8uaXNFbXB0eShzZWNyZXQpID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgICByZXR1cm4gc2VjcmV0O1xuICAgIH1cbiAgICAvLyBpdCBnZW5lcmF0ZXMgYSBzZWNyZXQga2V5XG4gICAgLy8gRlVUVVJFOiB0aGlzIG1pZ2h0IGJlIGFuIGV4dGVybmFsIHNlY3JldCBrZXksIHBlcmhhcHMgd2l0aGluIGNvbmZpZyBmaWxlP1xuICAgIHRoaXMuc2VjcmV0ID0gZ2VuZXJhdGVSYW5kb21IZXhTdHJpbmcoMzIpO1xuICAgIHJldHVybiB0aGlzLnNlY3JldDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25maWc7XG4iXX0=