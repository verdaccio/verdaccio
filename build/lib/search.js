'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lunr = require('lunr');

var _lunr2 = _interopRequireDefault(_lunr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Handle the search Indexer.
 */
class Search {

  /**
   * Constructor.
   */
  constructor() {
    /* eslint no-invalid-this: "off" */
    this.index = (0, _lunr2.default)(function () {
      this.field('name', { boost: 10 });
      this.field('description', { boost: 4 });
      this.field('author', { boost: 6 });
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
    return query === '*' ? this.storage.localStorage.localData.get(items => {
      items.map(function (pkg) {
        return { ref: pkg, score: 1 };
      });
    }) : this.index.search(query);
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
      author: pkg._npmUser ? pkg._npmUser.name : '???'
    });
  }

  /**
   * Remove an element from the index.
   * @param {*} name the id element
   */
  remove(name) {
    this.index.remove({ id: name });
  }

  /**
   * Force a reindex.
   */
  reindex() {
    let self = this;
    this.storage.getLocalDatabase(function (err, packages) {
      if (err) throw err; // that function shouldn't produce any
      let i = packages.length;
      while (i--) {
        self.add(packages[i]);
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

exports.default = new Search();