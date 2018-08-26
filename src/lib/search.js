/* eslint no-invalid-this: "off" */

'use strict';

const lunr = require('lunr');

/**
 * Handle the search Indexer.
 */
class Search {

  /**
   * Constructor.
   */
  constructor() {
    this.createIndex();
  }

  /**
   * Creates an empty search index.
   */
  createIndex() {
    this.index = lunr(function() {
      this.field('name', {boost: 10});
      this.field('description', {boost: 4});
      this.field('author', {boost: 6});
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
  query(q) {
	  return q === '*'
      ? this.storage.localStorage.localList.get().map( function( pkg ) {
        return {ref: pkg, score: 1};
      }) : this.index.search(q);
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
      author: pkg._npmUser ? pkg._npmUser.name : '???',
    });
  }

  /**
   * Remove an element from the index.
   * @param {*} name the id element
   */
  remove(name) {
    this.index.remove({id: name});
  }

  /**
   * Force a reindex.
   */
  reindex() {
    this.createIndex();
    let self = this;
    this.storage.get_local(function(err, packages) {
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
    this.storage.localStorage.localList.on('data', (data) => {
      this.reindex();
    });
  }
}

module.exports = new Search();
