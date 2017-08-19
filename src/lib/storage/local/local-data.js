'use strict';

const fs = require('fs');
const Path = require('path');
const logger = require('../../logger');

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
    let dbFile;

    try {
      dbFile = fs.readFileSync(this.path, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') { // Only recreate if file not found to prevent data loss
        logger.logger.error(
          'Failed to read package database file, please check the error printed below:\n',
          `File Path: ${this.path}\n\n`,
          err
        );
        this.locked = true; // Prevent any write action, wait admin to check what happened during startup
      }
    }

    if (dbFile) {
      try {
        this.data = JSON.parse(dbFile);
      } catch(err) {
        logger.logger.error(`Package database file corrupted (invalid JSON), please check the error printed below.\nFile Path: ${this.path}`, err);
        this.locked = true;
      }
    }

    if (!this.data) {
      this.data = {list: []};
    }
  }

  /**
   * Add a new element.
   * @param {*} name
   * @return {Error|*}
   */
  add(name) {
    if (this.data.list.indexOf(name) === -1) {
      this.data.list.push(name);
      return this.sync();
    }
  }

  /**
   * Remove an element from the database.
   * @param {*} name
   * @return {Error|*}
   */
  remove(name) {
    const i = this.data.list.indexOf(name);
    if (i !== -1) {
      this.data.list.splice(i, 1);
    }
    return this.sync();
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
   * @return {Error|*}
   */
  sync() {
    if (this.locked) {
      logger.logger.error('Database is locked, please check error message printed during startup to prevent data loss.');
      return new Error('Verdaccio database is locked, please contact your administrator to checkout logs during verdaccio startup.');
    }

    // Uses sync to prevent ugly race condition
    try {
      require('mkdirp').sync(Path.dirname(this.path));
    } catch(err) {
      // perhaps a logger instance?
      /* eslint no-empty:off */
    }
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data));
    } catch (err) {
      return err;
    }
  }

}

module.exports = LocalData;
