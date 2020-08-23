"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListListenAddresses = getListListenAddresses;
exports.resolveConfigPath = void 0;

var _path = _interopRequireDefault(require("path"));

var _utils = require("../utils");

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @prettier
 * @flow
 */
const logger = require('../logger');

const resolveConfigPath = function (storageLocation, file) {
  return _path.default.resolve(_path.default.dirname(storageLocation), file);
};
/**
 * Retrieve all addresses defined in the config file.
 * Verdaccio is able to listen multiple ports
 * @param {String} argListen
 * @param {String} configListen
 * eg:
 *  listen:
 - localhost:5555
 - localhost:5557
 @return {Array}
 */


exports.resolveConfigPath = resolveConfigPath;

function getListListenAddresses(argListen, configListen) {
  // command line || config file || default
  let addresses;

  if (argListen) {
    addresses = [argListen];
  } else if (Array.isArray(configListen)) {
    addresses = configListen;
  } else if (configListen) {
    addresses = [configListen];
  } else {
    addresses = [_constants.DEFAULT_PORT];
  }

  addresses = addresses.map(function (addr) {
    const parsedAddr = (0, _utils.parseAddress)(addr);

    if (!parsedAddr) {
      logger.logger.warn({
        addr: addr
      }, 'invalid address - @{addr}, we expect a port (e.g. "4873"),' + ' host:port (e.g. "localhost:4873") or full url' + ' (e.g. "http://localhost:4873/")');
    }

    return parsedAddr;
  }).filter(Boolean);
  return addresses;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY2xpL3V0aWxzLnRzIl0sIm5hbWVzIjpbImxvZ2dlciIsInJlcXVpcmUiLCJyZXNvbHZlQ29uZmlnUGF0aCIsInN0b3JhZ2VMb2NhdGlvbiIsImZpbGUiLCJwYXRoIiwicmVzb2x2ZSIsImRpcm5hbWUiLCJnZXRMaXN0TGlzdGVuQWRkcmVzc2VzIiwiYXJnTGlzdGVuIiwiY29uZmlnTGlzdGVuIiwiYWRkcmVzc2VzIiwiQXJyYXkiLCJpc0FycmF5IiwiREVGQVVMVF9QT1JUIiwibWFwIiwiYWRkciIsInBhcnNlZEFkZHIiLCJ3YXJuIiwiZmlsdGVyIiwiQm9vbGVhbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFLQTs7QUFFQTs7QUFDQTs7OztBQVJBOzs7O0FBVUEsTUFBTUEsTUFBTSxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUF0Qjs7QUFFTyxNQUFNQyxpQkFBaUIsR0FBRyxVQUFTQyxlQUFULEVBQWtDQyxJQUFsQyxFQUFnRDtBQUMvRSxTQUFPQyxjQUFLQyxPQUFMLENBQWFELGNBQUtFLE9BQUwsQ0FBYUosZUFBYixDQUFiLEVBQTRDQyxJQUE1QyxDQUFQO0FBQ0QsQ0FGTTtBQUlQOzs7Ozs7Ozs7Ozs7Ozs7QUFXTyxTQUFTSSxzQkFBVCxDQUFnQ0MsU0FBaEMsRUFBbURDLFlBQW5ELEVBQTJFO0FBQ2hGO0FBQ0EsTUFBSUMsU0FBSjs7QUFDQSxNQUFJRixTQUFKLEVBQWU7QUFDYkUsSUFBQUEsU0FBUyxHQUFHLENBQUNGLFNBQUQsQ0FBWjtBQUNELEdBRkQsTUFFTyxJQUFJRyxLQUFLLENBQUNDLE9BQU4sQ0FBY0gsWUFBZCxDQUFKLEVBQWlDO0FBQ3RDQyxJQUFBQSxTQUFTLEdBQUdELFlBQVo7QUFDRCxHQUZNLE1BRUEsSUFBSUEsWUFBSixFQUFrQjtBQUN2QkMsSUFBQUEsU0FBUyxHQUFHLENBQUNELFlBQUQsQ0FBWjtBQUNELEdBRk0sTUFFQTtBQUNMQyxJQUFBQSxTQUFTLEdBQUcsQ0FBQ0csdUJBQUQsQ0FBWjtBQUNEOztBQUNESCxFQUFBQSxTQUFTLEdBQUdBLFNBQVMsQ0FDbEJJLEdBRFMsQ0FDTCxVQUFTQyxJQUFULEVBQXVCO0FBQzFCLFVBQU1DLFVBQVUsR0FBRyx5QkFBYUQsSUFBYixDQUFuQjs7QUFFQSxRQUFJLENBQUNDLFVBQUwsRUFBaUI7QUFDZmpCLE1BQUFBLE1BQU0sQ0FBQ0EsTUFBUCxDQUFja0IsSUFBZCxDQUNFO0FBQUVGLFFBQUFBLElBQUksRUFBRUE7QUFBUixPQURGLEVBRUUsK0RBQ0UsZ0RBREYsR0FFRSxrQ0FKSjtBQU1EOztBQUVELFdBQU9DLFVBQVA7QUFDRCxHQWRTLEVBZVRFLE1BZlMsQ0FlRkMsT0FmRSxDQUFaO0FBaUJBLFNBQU9ULFNBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHByZXR0aWVyXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyBwYXJzZUFkZHJlc3MgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBERUZBVUxUX1BPUlQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5jb25zdCBsb2dnZXIgPSByZXF1aXJlKCcuLi9sb2dnZXInKTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVDb25maWdQYXRoID0gZnVuY3Rpb24oc3RvcmFnZUxvY2F0aW9uOiBzdHJpbmcsIGZpbGU6IHN0cmluZykge1xuICByZXR1cm4gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShzdG9yYWdlTG9jYXRpb24pLCBmaWxlKTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgYWxsIGFkZHJlc3NlcyBkZWZpbmVkIGluIHRoZSBjb25maWcgZmlsZS5cbiAqIFZlcmRhY2NpbyBpcyBhYmxlIHRvIGxpc3RlbiBtdWx0aXBsZSBwb3J0c1xuICogQHBhcmFtIHtTdHJpbmd9IGFyZ0xpc3RlblxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZ0xpc3RlblxuICogZWc6XG4gKiAgbGlzdGVuOlxuIC0gbG9jYWxob3N0OjU1NTVcbiAtIGxvY2FsaG9zdDo1NTU3XG4gQHJldHVybiB7QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0TGlzdGVuQWRkcmVzc2VzKGFyZ0xpc3Rlbjogc3RyaW5nLCBjb25maWdMaXN0ZW46IGFueSk6IGFueSB7XG4gIC8vIGNvbW1hbmQgbGluZSB8fCBjb25maWcgZmlsZSB8fCBkZWZhdWx0XG4gIGxldCBhZGRyZXNzZXM7XG4gIGlmIChhcmdMaXN0ZW4pIHtcbiAgICBhZGRyZXNzZXMgPSBbYXJnTGlzdGVuXTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNvbmZpZ0xpc3RlbikpIHtcbiAgICBhZGRyZXNzZXMgPSBjb25maWdMaXN0ZW47XG4gIH0gZWxzZSBpZiAoY29uZmlnTGlzdGVuKSB7XG4gICAgYWRkcmVzc2VzID0gW2NvbmZpZ0xpc3Rlbl07XG4gIH0gZWxzZSB7XG4gICAgYWRkcmVzc2VzID0gW0RFRkFVTFRfUE9SVF07XG4gIH1cbiAgYWRkcmVzc2VzID0gYWRkcmVzc2VzXG4gICAgLm1hcChmdW5jdGlvbihhZGRyKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IHBhcnNlZEFkZHIgPSBwYXJzZUFkZHJlc3MoYWRkcik7XG5cbiAgICAgIGlmICghcGFyc2VkQWRkcikge1xuICAgICAgICBsb2dnZXIubG9nZ2VyLndhcm4oXG4gICAgICAgICAgeyBhZGRyOiBhZGRyIH0sXG4gICAgICAgICAgJ2ludmFsaWQgYWRkcmVzcyAtIEB7YWRkcn0sIHdlIGV4cGVjdCBhIHBvcnQgKGUuZy4gXCI0ODczXCIpLCcgK1xuICAgICAgICAgICAgJyBob3N0OnBvcnQgKGUuZy4gXCJsb2NhbGhvc3Q6NDg3M1wiKSBvciBmdWxsIHVybCcgK1xuICAgICAgICAgICAgJyAoZS5nLiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDg3My9cIiknXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXJzZWRBZGRyO1xuICAgIH0pXG4gICAgLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gYWRkcmVzc2VzO1xufVxuIl19