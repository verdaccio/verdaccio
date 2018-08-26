'use strict';

const fs = require('fs');
const Path = require('path');
const EventEmitter = require('events').EventEmitter;
const logger = require('../../logger');

/**
 * The default value for the database watcher poll interval.
 * @type {number}
 * @todo FUTURE: should go to the configuration.
 */
const DEFAULT_WATCH_POLL_INTERVAL = 1000;

/**
 * Handle local database.
 * FUTURE: must be a plugin.
 */
 class LocalData extends EventEmitter {

  /**
   * Load an parse the local json database.yarn
   * @param {*} path the database path
   */
   constructor(path) {
    super();
    this.path = path;
    // Prevent any write action, wait admin to check what happened during startup
    this.locked = false;
    this.watch = true;
    this._updateData();
    // Default 
    fs.watchFile(this.path, {
      persistent: false,
      interval: DEFAULT_WATCH_POLL_INTERVAL,
    }, () => {
      this._updateData();
    });
  }

  /**
   * Updates in-memory data from local storage.
   * 
   * @private
   * @fires LocalData#data
   */
  _updateData() {
    if (this.watch) {
      this.data = this._fetchLocalPackages();
      /**
       * Data event.
       *
       * @event LocalData#data
       * @type {Object}
       * @property {string[]} list - List of package names.
       * @property {string} secret - The secret key.
       */
      this.emit('data', this.data);
    }
  }

  /**
   * Fetch local packages.
   * @private
   * @return {Object}
   */
  _fetchLocalPackages() {
    const emptyDatabase = {list: []};

    try {
      const dbFile = fs.readFileSync(this.path, 'utf8');

      if (!dbFile) { // readFileSync is platform specific, FreeBSD might return null
        return emptyDatabase;
      }

      const db = this._parseDatabase(dbFile);

      if(!db) {
        return emptyDatabase;
      }

      return db;
    } catch (err) {
      // readFileSync is platform specific, macOS, Linux and Windows thrown an error
      // Only recreate if file not found to prevent data loss
      if (err.code !== 'ENOENT') {
        this.locked = true;
        logger.logger.error(
          'Failed to read package database file, please check the error printed below:\n',
          `File Path: ${this.path}\n\n`,
          err
        );
      }
      return emptyDatabase;
    }
  }

  /**
   * Parse the local database.
   * @param {Object} dbFile
   * @private
   * @return {Object}
   */
  _parseDatabase(dbFile) {
    try {
      return JSON.parse(dbFile);
    } catch(err) {
      logger.logger.error(`Package database file corrupted (invalid JSON), please check the error printed below.\nFile Path: ${this.path}`, err);
      this.locked = true;
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
    // don't get self-notified.
    this.watch = false;
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
    } finally {
      this.watch = true;
    }
  }

}

module.exports = LocalData;
module.exports.DEFAULT_WATCH_POLL_INTERVAL = DEFAULT_WATCH_POLL_INTERVAL;
