"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lunrMutableIndexes = _interopRequireDefault(require("lunr-mutable-indexes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Handle the search Indexer.
 */
class Search {
  // @ts-ignore

  /**
   * Constructor.
   */
  constructor() {
    _defineProperty(this, "index", void 0);

    _defineProperty(this, "storage", void 0);

    this.index = (0, _lunrMutableIndexes.default)(function () {
      // FIXME: there is no types for this library

      /* eslint no-invalid-this:off */
      // @ts-ignore
      this.field('name', {
        boost: 10
      }); // @ts-ignore

      this.field('description', {
        boost: 4
      }); // @ts-ignore

      this.field('author', {
        boost: 6
      }); // @ts-ignore

      this.field('keywords', {
        boost: 7
      }); // @ts-ignore

      this.field('version'); // @ts-ignore

      this.field('readme');
    });
  }
  /**
   * Performs a query to the indexer.
   * If the keyword is a * it returns all local elements
   * otherwise performs a search
   * @param {*} q the keyword
   * @return {Array} list of results.
   */


  query(query) {
    const localStorage = this.storage.localStorage;
    return query === '*' ? localStorage.storagePlugin.get(items => {
      items.map(function (pkg) {
        return {
          ref: pkg,
          score: 1
        };
      });
    }) : this.index.search(`*${query}*`);
  }
  /**
   * Add a new element to index
   * @param {*} pkg the package
   */


  add(pkg) {
    this.index.add({
      id: pkg.name,
      name: pkg.name,
      description: pkg.description,
      version: `v${pkg.version}`,
      keywords: pkg.keywords,
      author: pkg._npmUser ? pkg._npmUser.name : '???'
    });
  }
  /**
   * Remove an element from the index.
   * @param {*} name the id element
   */


  remove(name) {
    this.index.remove({
      id: name
    });
  }
  /**
   * Force a re-index.
   */


  reindex() {
    this.storage.getLocalDatabase((error, packages) => {
      if (error) {
        // that function shouldn't produce any
        throw error;
      }

      let i = packages.length;

      while (i--) {
        this.add(packages[i]);
      }
    });
  }
  /**
   * Set up the {Storage}
   * @param {*} storage An storage reference.
   */


  configureStorage(storage) {
    this.storage = storage;
    this.reindex();
  }

}

var _default = new Search();

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc2VhcmNoLnRzIl0sIm5hbWVzIjpbIlNlYXJjaCIsImNvbnN0cnVjdG9yIiwiaW5kZXgiLCJmaWVsZCIsImJvb3N0IiwicXVlcnkiLCJsb2NhbFN0b3JhZ2UiLCJzdG9yYWdlIiwic3RvcmFnZVBsdWdpbiIsImdldCIsIml0ZW1zIiwibWFwIiwicGtnIiwicmVmIiwic2NvcmUiLCJzZWFyY2giLCJhZGQiLCJpZCIsIm5hbWUiLCJkZXNjcmlwdGlvbiIsInZlcnNpb24iLCJrZXl3b3JkcyIsImF1dGhvciIsIl9ucG1Vc2VyIiwicmVtb3ZlIiwicmVpbmRleCIsImdldExvY2FsRGF0YWJhc2UiLCJlcnJvciIsInBhY2thZ2VzIiwiaSIsImxlbmd0aCIsImNvbmZpZ3VyZVN0b3JhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7O0FBR0E7OztBQUdBLE1BQU1BLE1BQU4sQ0FBbUM7QUFFakM7O0FBR0E7OztBQUdPQyxFQUFBQSxXQUFQLEdBQXFCO0FBQUE7O0FBQUE7O0FBQ25CLFNBQUtDLEtBQUwsR0FBYSxpQ0FBWSxZQUFpQjtBQUN4Qzs7QUFDQTtBQUNBO0FBQ0EsV0FBS0MsS0FBTCxDQUFXLE1BQVgsRUFBbUI7QUFBRUMsUUFBQUEsS0FBSyxFQUFFO0FBQVQsT0FBbkIsRUFKd0MsQ0FLeEM7O0FBQ0EsV0FBS0QsS0FBTCxDQUFXLGFBQVgsRUFBMEI7QUFBRUMsUUFBQUEsS0FBSyxFQUFFO0FBQVQsT0FBMUIsRUFOd0MsQ0FPeEM7O0FBQ0EsV0FBS0QsS0FBTCxDQUFXLFFBQVgsRUFBcUI7QUFBRUMsUUFBQUEsS0FBSyxFQUFFO0FBQVQsT0FBckIsRUFSd0MsQ0FTeEM7O0FBQ0EsV0FBS0QsS0FBTCxDQUFXLFVBQVgsRUFBdUI7QUFBRUMsUUFBQUEsS0FBSyxFQUFFO0FBQVQsT0FBdkIsRUFWd0MsQ0FXeEM7O0FBQ0EsV0FBS0QsS0FBTCxDQUFXLFNBQVgsRUFad0MsQ0FheEM7O0FBQ0EsV0FBS0EsS0FBTCxDQUFXLFFBQVg7QUFDRCxLQWZZLENBQWI7QUFnQkQ7QUFFRDs7Ozs7Ozs7O0FBT09FLEVBQUFBLEtBQVAsQ0FBYUEsS0FBYixFQUFtQztBQUNqQyxVQUFNQyxZQUFZLEdBQUcsS0FBS0MsT0FBTCxDQUFhRCxZQUFsQztBQUVBLFdBQU9ELEtBQUssS0FBSyxHQUFWLEdBQWdCQyxZQUFZLENBQUNFLGFBQWIsQ0FBMkJDLEdBQTNCLENBQWdDQyxLQUFELElBQWdCO0FBQ3BFQSxNQUFBQSxLQUFLLENBQUNDLEdBQU4sQ0FBVSxVQUFTQyxHQUFULEVBQW1CO0FBQzNCLGVBQU87QUFBRUMsVUFBQUEsR0FBRyxFQUFFRCxHQUFQO0FBQVlFLFVBQUFBLEtBQUssRUFBRTtBQUFuQixTQUFQO0FBQ0QsT0FGRDtBQUdELEtBSnNCLENBQWhCLEdBSUYsS0FBS1osS0FBTCxDQUFXYSxNQUFYLENBQW1CLElBQUdWLEtBQU0sR0FBNUIsQ0FKTDtBQUtEO0FBRUQ7Ozs7OztBQUlPVyxFQUFBQSxHQUFQLENBQVdKLEdBQVgsRUFBK0I7QUFDN0IsU0FBS1YsS0FBTCxDQUFXYyxHQUFYLENBQWU7QUFDYkMsTUFBQUEsRUFBRSxFQUFFTCxHQUFHLENBQUNNLElBREs7QUFFYkEsTUFBQUEsSUFBSSxFQUFFTixHQUFHLENBQUNNLElBRkc7QUFHYkMsTUFBQUEsV0FBVyxFQUFFUCxHQUFHLENBQUNPLFdBSEo7QUFJYkMsTUFBQUEsT0FBTyxFQUFHLElBQUdSLEdBQUcsQ0FBQ1EsT0FBUSxFQUpaO0FBS2JDLE1BQUFBLFFBQVEsRUFBRVQsR0FBRyxDQUFDUyxRQUxEO0FBTWJDLE1BQUFBLE1BQU0sRUFBRVYsR0FBRyxDQUFDVyxRQUFKLEdBQWVYLEdBQUcsQ0FBQ1csUUFBSixDQUFhTCxJQUE1QixHQUFtQztBQU45QixLQUFmO0FBUUQ7QUFFRDs7Ozs7O0FBSU9NLEVBQUFBLE1BQVAsQ0FBY04sSUFBZCxFQUFrQztBQUNoQyxTQUFLaEIsS0FBTCxDQUFXc0IsTUFBWCxDQUFrQjtBQUFFUCxNQUFBQSxFQUFFLEVBQUVDO0FBQU4sS0FBbEI7QUFDRDtBQUVEOzs7OztBQUdPTyxFQUFBQSxPQUFQLEdBQXVCO0FBQ3JCLFNBQUtsQixPQUFMLENBQWFtQixnQkFBYixDQUE4QixDQUFDQyxLQUFELEVBQVFDLFFBQVIsS0FBMkI7QUFDdkQsVUFBSUQsS0FBSixFQUFXO0FBQ1Q7QUFDQSxjQUFNQSxLQUFOO0FBQ0Q7O0FBQ0QsVUFBSUUsQ0FBQyxHQUFHRCxRQUFRLENBQUNFLE1BQWpCOztBQUNBLGFBQU9ELENBQUMsRUFBUixFQUFZO0FBQ1YsYUFBS2IsR0FBTCxDQUFTWSxRQUFRLENBQUNDLENBQUQsQ0FBakI7QUFDRDtBQUNGLEtBVEQ7QUFVRDtBQUVEOzs7Ozs7QUFJT0UsRUFBQUEsZ0JBQVAsQ0FBd0J4QixPQUF4QixFQUF3RDtBQUN0RCxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLa0IsT0FBTDtBQUNEOztBQTFGZ0M7O2VBNkZwQixJQUFJekIsTUFBSixFIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUgbm8taW52YWxpZC10aGlzXG5cbmltcG9ydCBsdW5yTXV0YWJsZSBmcm9tICdsdW5yLW11dGFibGUtaW5kZXhlcyc7XG5pbXBvcnQgeyBWZXJzaW9uIH0gZnJvbSAnQHZlcmRhY2Npby90eXBlcyc7XG5pbXBvcnQgeyBJU3RvcmFnZUhhbmRsZXIsIElXZWJTZWFyY2gsIElTdG9yYWdlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuLyoqXG4gKiBIYW5kbGUgdGhlIHNlYXJjaCBJbmRleGVyLlxuICovXG5jbGFzcyBTZWFyY2ggaW1wbGVtZW50cyBJV2ViU2VhcmNoIHtcbiAgcHVibGljIGluZGV4OiBsdW5yTXV0YWJsZS5pbmRleDtcbiAgLy8gQHRzLWlnbm9yZVxuICBwdWJsaWMgc3RvcmFnZTogSVN0b3JhZ2VIYW5kbGVyO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3Rvci5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmluZGV4ID0gbHVuck11dGFibGUoZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAvLyBGSVhNRTogdGhlcmUgaXMgbm8gdHlwZXMgZm9yIHRoaXMgbGlicmFyeVxuICAgICAgLyogZXNsaW50IG5vLWludmFsaWQtdGhpczpvZmYgKi9cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMuZmllbGQoJ25hbWUnLCB7IGJvb3N0OiAxMCB9KTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMuZmllbGQoJ2Rlc2NyaXB0aW9uJywgeyBib29zdDogNCB9KTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMuZmllbGQoJ2F1dGhvcicsIHsgYm9vc3Q6IDYgfSk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLmZpZWxkKCdrZXl3b3JkcycsIHsgYm9vc3Q6IDcgfSk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLmZpZWxkKCd2ZXJzaW9uJyk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLmZpZWxkKCdyZWFkbWUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIHF1ZXJ5IHRvIHRoZSBpbmRleGVyLlxuICAgKiBJZiB0aGUga2V5d29yZCBpcyBhICogaXQgcmV0dXJucyBhbGwgbG9jYWwgZWxlbWVudHNcbiAgICogb3RoZXJ3aXNlIHBlcmZvcm1zIGEgc2VhcmNoXG4gICAqIEBwYXJhbSB7Kn0gcSB0aGUga2V5d29yZFxuICAgKiBAcmV0dXJuIHtBcnJheX0gbGlzdCBvZiByZXN1bHRzLlxuICAgKi9cbiAgcHVibGljIHF1ZXJ5KHF1ZXJ5OiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgY29uc3QgbG9jYWxTdG9yYWdlID0gdGhpcy5zdG9yYWdlLmxvY2FsU3RvcmFnZSBhcyBJU3RvcmFnZTtcblxuICAgIHJldHVybiBxdWVyeSA9PT0gJyonID8gbG9jYWxTdG9yYWdlLnN0b3JhZ2VQbHVnaW4uZ2V0KChpdGVtcyk6IGFueSA9PiB7XG4gICAgICBpdGVtcy5tYXAoZnVuY3Rpb24ocGtnKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHsgcmVmOiBwa2csIHNjb3JlOiAxIH07XG4gICAgICB9KTtcbiAgICB9KSA6IHRoaXMuaW5kZXguc2VhcmNoKGAqJHtxdWVyeX0qYCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGVsZW1lbnQgdG8gaW5kZXhcbiAgICogQHBhcmFtIHsqfSBwa2cgdGhlIHBhY2thZ2VcbiAgICovXG4gIHB1YmxpYyBhZGQocGtnOiBWZXJzaW9uKTogdm9pZCB7XG4gICAgdGhpcy5pbmRleC5hZGQoe1xuICAgICAgaWQ6IHBrZy5uYW1lLFxuICAgICAgbmFtZTogcGtnLm5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogcGtnLmRlc2NyaXB0aW9uLFxuICAgICAgdmVyc2lvbjogYHYke3BrZy52ZXJzaW9ufWAsXG4gICAgICBrZXl3b3JkczogcGtnLmtleXdvcmRzLFxuICAgICAgYXV0aG9yOiBwa2cuX25wbVVzZXIgPyBwa2cuX25wbVVzZXIubmFtZSA6ICc/Pz8nLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbGVtZW50IGZyb20gdGhlIGluZGV4LlxuICAgKiBAcGFyYW0geyp9IG5hbWUgdGhlIGlkIGVsZW1lbnRcbiAgICovXG4gIHB1YmxpYyByZW1vdmUobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5pbmRleC5yZW1vdmUoeyBpZDogbmFtZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JjZSBhIHJlLWluZGV4LlxuICAgKi9cbiAgcHVibGljIHJlaW5kZXgoKTogdm9pZCB7XG4gICAgdGhpcy5zdG9yYWdlLmdldExvY2FsRGF0YWJhc2UoKGVycm9yLCBwYWNrYWdlcyk6IHZvaWQgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIC8vIHRoYXQgZnVuY3Rpb24gc2hvdWxkbid0IHByb2R1Y2UgYW55XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgICAgbGV0IGkgPSBwYWNrYWdlcy5sZW5ndGg7XG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHRoaXMuYWRkKHBhY2thZ2VzW2ldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdXAgdGhlIHtTdG9yYWdlfVxuICAgKiBAcGFyYW0geyp9IHN0b3JhZ2UgQW4gc3RvcmFnZSByZWZlcmVuY2UuXG4gICAqL1xuICBwdWJsaWMgY29uZmlndXJlU3RvcmFnZShzdG9yYWdlOiBJU3RvcmFnZUhhbmRsZXIpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgIHRoaXMucmVpbmRleCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTZWFyY2goKTtcbiJdfQ==