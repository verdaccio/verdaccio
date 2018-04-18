'use strict';

const assert = require('assert');
const LocalData = require('../../src/lib/storage/local/local-data');
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const touch = require('touch');


describe('Local Database', function() {

  const buildCorruptedPath = () => path.join(__dirname, './partials/storage/verdaccio-corrupted.db.json');
  const buildValidDbPath = () => path.join(__dirname, './partials/storage/verdaccio.db.json');

  describe('reading database', () => {

    it('should return empty database on read corrupted database', () => {
      const dataLocal = new LocalData(buildCorruptedPath());

      assert(_.isEmpty(dataLocal.data.list));
    });

    it('should return a database on read valid database', () => {
      const dataLocal = new LocalData(buildValidDbPath());

      assert(_.isEmpty(dataLocal.data.list) === false);
    });

    it('should fails on sync a corrupted database', () => {
      const dataLocal = new LocalData(buildCorruptedPath());
      const error = dataLocal.sync();

      assert(_.isError(error));
      assert(error.message.match(/locked/));
      assert(dataLocal.locked);
    });

    it('should emit an event when database file is touched', (done) => {
      const dataPath = buildValidDbPath();
      const dataLocal = new LocalData(dataPath);
      dataLocal.on('data', (data) => {
        assert(_.isEmpty(data.list) === false);
        assert(_.isNil(data.secret) === false);
        assert(_.isEqual(data, dataLocal.data));
        done();
      });
      touch.sync(dataPath);
    }).timeout(LocalData.DEFAULT_WATCH_POLL_INTERVAL + 100);

  });

  describe('add/remove packages to database', () => {
    it('should add a new package to local database', () => {
      const dataLocal = new LocalData(buildCorruptedPath());
      assert(_.isEmpty(dataLocal.data.list));
      dataLocal.add('package1');
      assert(!_.isEmpty(dataLocal.data.list));
    });

    it('should remove a new package to local database', () => {
      const dataLocal = new LocalData(buildCorruptedPath());
      const pkgName = 'package1';

      assert(_.isEmpty(dataLocal.data.list));
      dataLocal.add(pkgName);
      dataLocal.remove(pkgName);
      assert(_.isEmpty(dataLocal.data.list));
    });
  });

  describe('sync packages to database', () => {
    beforeEach(function() {
      this.newDb = path.join(__dirname, './test-storage/verdaccio.temp.db.json');
      fs.copySync(buildValidDbPath(), this.newDb);
    });

    it('should check sync packages', function() {
      const localData1 = new LocalData(this.newDb);

      localData1.add('package1');

      const localData2 = new LocalData(this.newDb);

      assert(_.isEmpty(localData2.data.list) === false);
      assert(localData2.data.list.length === 2);

    });


  });

});

