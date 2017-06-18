'use strict';

const fs = require('fs');
const Path = require('path');

/**
 * Handle local database.
 * FUTURE: must be a plugin.
 */
 class LocalData {

  /**
   * Load an parse the local json database.
   * @param {*} path the database path
   */
   constructor(path) {
    this.path = path;
    try {
      this.data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    } catch(_) {
      this.data = {list: []};
    }
  }

  /**
   * Add a new element.
   * @param {*} name
   */
  add(name) {
    if (this.data.list.indexOf(name) === -1) {
      this.data.list.push(name);
      this.sync();
    }
  }

  /**
   * Remove an element from the database.
   * @param {*} name
   */
  remove(name) {
    const i = this.data.list.indexOf(name);
    if (i !== -1) {
      this.data.list.splice(i, 1);
    }
    this.sync();
  }

  /**
   * Return all database elements.
   * @return {Array}
   */
  get() {
    return this.data.list;
  }

  /**
   * Syncronize {create} database whether does not exist.
   */
  sync() {
    // Uses sync to prevent ugly race condition
    try {
      require('mkdirp').sync(Path.dirname(this.path));
    } catch(err) {
      // perhaps a logger instance?
      /* eslint no-empty:off */
    }
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

}

module.exports = LocalData;
