/* eslint no-invalid-this: "off" */

'use strict';

const elasticlunr = require('elasticlunr');
const _ = require('lodash');

/**
 * Handle the search Indexer.
 */
class Search {

  /**
   * Constructor.
   */
  constructor() {
    try {
      const customized_stop_words = ['@', '-', '_', '.'];
      elasticlunr.addStopWords(customized_stop_words);
      this.index = elasticlunr(function() {
        this.setRef('id');
        this.addField('name');
        this.addField('description');
        this.addField('author');
        this.addField('license');
        this.addField('keywords');
        this.addField('version');
        this.addField('readme');
      });
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Performs a query to the indexer.
   * If the keyword is a * it returns all local elements
   * otherwise performs a search
   * @param {*} query the keyword
   * @return {Array} list of results.
   */
  query(query) {
	  const results = query === '*'
      ? this.storage.localStorage.localList.get().map( function( packageName ) {
        return {
          ref: packageName,
          score: 1,
        };
      }) : this.index.search(query, {
        fields: {
          name: {boost: 2},
          description: {boost: 1},
          version: {boost: 1},
          license: {boost: 1},
          author: {boost: 0.1},
          keywords: {boost: 2},
        },
        bool: 'OR',
        expand: true,
      });
	  return results;

  }

  /**
   * Add a new element to index
   * @param {*} pkg the package
   */
  add(pkg) {
    this.index.addDoc({
      id: pkg.name,
      name: pkg.name,
      description: pkg.description,
      version: pkg.version,
      keywords: _.isArray(pkg.keyword) ? pkg.join(' '): '',
      author: pkg.author ? pkg.author.name : '???',
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
    let self = this;
    this.storage.get_local(function(err, packages) {
      if (err) {
        throw err;
      } // that function shouldn't produce any
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

module.exports = new Search();
