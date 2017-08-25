'use strict';

const assert = require('assert');
const LocalData = require('../../src/lib/storage/local/local-data');
const path = require('path');
const _ = require('lodash');


describe('Local Database', function() {


  describe('reading database', () => {

    const buildCorruptedPath = () => path.join(__dirname, './partials/storage/verdaccio-corrupted.db.json');

    it('should return empty database on read corrupted database', () => {
      const config = new LocalData(buildCorruptedPath());
      assert(_.isEmpty(config.data.list));
    });

    it('should return a database on read valid database', () => {
      const config = new LocalData(path.join(__dirname, './partials/storage/verdaccio.db.json'));
      assert(_.isEmpty(config.data.list) === false);
    });

    it('should fails on sync a corrupted database', () => {
      const config = new LocalData(buildCorruptedPath());
      const error = config.sync();

      assert(_.isError(error));
      assert(error.message.match(/locked/));
    });

  });

});

