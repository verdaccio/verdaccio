"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeVersions = mergeVersions;

var _semver = _interopRequireDefault(require("semver"));

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @prettier
 * @flow
 */

/**
 * Function gets a local info and an info from uplinks and tries to merge it
 exported for unit tests only.
  * @param {*} local
  * @param {*} up
  * @param {*} config
  * @static
  */
function mergeVersions(local, up) {
  // copy new versions to a cache
  // NOTE: if a certain version was updated, we can't refresh it reliably
  for (const i in up.versions) {
    if (_lodash.default.isNil(local.versions[i])) {
      local.versions[i] = up.versions[i];
    }
  }

  for (const i in up[_constants.DIST_TAGS]) {
    if (local[_constants.DIST_TAGS][i] !== up[_constants.DIST_TAGS][i]) {
      if (!local[_constants.DIST_TAGS][i] || _semver.default.lte(local[_constants.DIST_TAGS][i], up[_constants.DIST_TAGS][i])) {
        local[_constants.DIST_TAGS][i] = up[_constants.DIST_TAGS][i];
      }

      if (i === 'latest' && local[_constants.DIST_TAGS][i] === up[_constants.DIST_TAGS][i]) {
        // if remote has more fresh package, we should borrow its readme
        local.readme = up.readme;
      }
    }
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbWV0YWRhdGEtdXRpbHMudHMiXSwibmFtZXMiOlsibWVyZ2VWZXJzaW9ucyIsImxvY2FsIiwidXAiLCJpIiwidmVyc2lvbnMiLCJfIiwiaXNOaWwiLCJESVNUX1RBR1MiLCJzZW12ZXIiLCJsdGUiLCJyZWFkbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7QUFDQTs7QUFDQTs7OztBQVBBOzs7OztBQVdBOzs7Ozs7OztBQVFPLFNBQVNBLGFBQVQsQ0FBdUJDLEtBQXZCLEVBQXVDQyxFQUF2QyxFQUFvRDtBQUN6RDtBQUNBO0FBQ0EsT0FBSyxNQUFNQyxDQUFYLElBQWdCRCxFQUFFLENBQUNFLFFBQW5CLEVBQTZCO0FBQzNCLFFBQUlDLGdCQUFFQyxLQUFGLENBQVFMLEtBQUssQ0FBQ0csUUFBTixDQUFlRCxDQUFmLENBQVIsQ0FBSixFQUFnQztBQUM5QkYsTUFBQUEsS0FBSyxDQUFDRyxRQUFOLENBQWVELENBQWYsSUFBb0JELEVBQUUsQ0FBQ0UsUUFBSCxDQUFZRCxDQUFaLENBQXBCO0FBQ0Q7QUFDRjs7QUFFRCxPQUFLLE1BQU1BLENBQVgsSUFBZ0JELEVBQUUsQ0FBQ0ssb0JBQUQsQ0FBbEIsRUFBK0I7QUFDN0IsUUFBSU4sS0FBSyxDQUFDTSxvQkFBRCxDQUFMLENBQWlCSixDQUFqQixNQUF3QkQsRUFBRSxDQUFDSyxvQkFBRCxDQUFGLENBQWNKLENBQWQsQ0FBNUIsRUFBOEM7QUFDNUMsVUFBSSxDQUFDRixLQUFLLENBQUNNLG9CQUFELENBQUwsQ0FBaUJKLENBQWpCLENBQUQsSUFBd0JLLGdCQUFPQyxHQUFQLENBQVdSLEtBQUssQ0FBQ00sb0JBQUQsQ0FBTCxDQUFpQkosQ0FBakIsQ0FBWCxFQUFnQ0QsRUFBRSxDQUFDSyxvQkFBRCxDQUFGLENBQWNKLENBQWQsQ0FBaEMsQ0FBNUIsRUFBK0U7QUFDN0VGLFFBQUFBLEtBQUssQ0FBQ00sb0JBQUQsQ0FBTCxDQUFpQkosQ0FBakIsSUFBc0JELEVBQUUsQ0FBQ0ssb0JBQUQsQ0FBRixDQUFjSixDQUFkLENBQXRCO0FBQ0Q7O0FBQ0QsVUFBSUEsQ0FBQyxLQUFLLFFBQU4sSUFBa0JGLEtBQUssQ0FBQ00sb0JBQUQsQ0FBTCxDQUFpQkosQ0FBakIsTUFBd0JELEVBQUUsQ0FBQ0ssb0JBQUQsQ0FBRixDQUFjSixDQUFkLENBQTlDLEVBQWdFO0FBQzlEO0FBQ0FGLFFBQUFBLEtBQUssQ0FBQ1MsTUFBTixHQUFlUixFQUFFLENBQUNRLE1BQWxCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwcmV0dGllclxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgRElTVF9UQUdTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBQYWNrYWdlIH0gZnJvbSAnQHZlcmRhY2Npby90eXBlcyc7XG5cbi8qKlxuICogRnVuY3Rpb24gZ2V0cyBhIGxvY2FsIGluZm8gYW5kIGFuIGluZm8gZnJvbSB1cGxpbmtzIGFuZCB0cmllcyB0byBtZXJnZSBpdFxuIGV4cG9ydGVkIGZvciB1bml0IHRlc3RzIG9ubHkuXG4gICogQHBhcmFtIHsqfSBsb2NhbFxuICAqIEBwYXJhbSB7Kn0gdXBcbiAgKiBAcGFyYW0geyp9IGNvbmZpZ1xuICAqIEBzdGF0aWNcbiAgKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVZlcnNpb25zKGxvY2FsOiBQYWNrYWdlLCB1cDogUGFja2FnZSkge1xuICAvLyBjb3B5IG5ldyB2ZXJzaW9ucyB0byBhIGNhY2hlXG4gIC8vIE5PVEU6IGlmIGEgY2VydGFpbiB2ZXJzaW9uIHdhcyB1cGRhdGVkLCB3ZSBjYW4ndCByZWZyZXNoIGl0IHJlbGlhYmx5XG4gIGZvciAoY29uc3QgaSBpbiB1cC52ZXJzaW9ucykge1xuICAgIGlmIChfLmlzTmlsKGxvY2FsLnZlcnNpb25zW2ldKSkge1xuICAgICAgbG9jYWwudmVyc2lvbnNbaV0gPSB1cC52ZXJzaW9uc1tpXTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IGkgaW4gdXBbRElTVF9UQUdTXSkge1xuICAgIGlmIChsb2NhbFtESVNUX1RBR1NdW2ldICE9PSB1cFtESVNUX1RBR1NdW2ldKSB7XG4gICAgICBpZiAoIWxvY2FsW0RJU1RfVEFHU11baV0gfHwgc2VtdmVyLmx0ZShsb2NhbFtESVNUX1RBR1NdW2ldLCB1cFtESVNUX1RBR1NdW2ldKSkge1xuICAgICAgICBsb2NhbFtESVNUX1RBR1NdW2ldID0gdXBbRElTVF9UQUdTXVtpXTtcbiAgICAgIH1cbiAgICAgIGlmIChpID09PSAnbGF0ZXN0JyAmJiBsb2NhbFtESVNUX1RBR1NdW2ldID09PSB1cFtESVNUX1RBR1NdW2ldKSB7XG4gICAgICAgIC8vIGlmIHJlbW90ZSBoYXMgbW9yZSBmcmVzaCBwYWNrYWdlLCB3ZSBzaG91bGQgYm9ycm93IGl0cyByZWFkbWVcbiAgICAgICAgbG9jYWwucmVhZG1lID0gdXAucmVhZG1lO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19