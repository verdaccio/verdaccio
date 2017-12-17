// @flow
import rimRaf from 'rimraf';
import path from 'path';
import LocalStorage from '../../src/lib/local-storage';
import AppConfig from '../../src/lib/config';
import configExample from './partials/config';
import Logger, {setup} from '../../src/lib/logger';
import {readFile} from '../functional/lib/test.utils';

const readMetadata = (fileName: string = 'metadata') => readFile(`../../unit/partials/${fileName}`);

import type {IStorage} from '@verdaccio/types';

setup([]);

describe('LocalStorage', () => {
  let storage: IStorage;
  const pkgName: string = 'npm_test';
  const pkgNameScoped = `@scope/${pkgName}-scope`;
  const tarballName: string = `${pkgName}-add-tarball-1.0.4.tgz`;
  const tarballName2: string = `${pkgName}-add-tarball-1.0.5.tgz`;

  beforeAll(function () {
    const config: Config = new AppConfig(configExample);
    config.self_path = path.join('../partials/store');

    storage = new LocalStorage(config, Logger.logger);
  });

  test('should be defined', () => {
    expect(storage).toBeDefined();
  });

  describe('LocalStorage::addPackage', () => {
    test('should add a package', (done) => {
      const metadata = JSON.parse(readMetadata());
      const pkgStoragePath: string = storage._getLocalStorage(pkgName);
      rimRaf(pkgStoragePath.path, (err) => {
        expect(err).toBeNull();
        storage.addPackage(pkgName, metadata, (err, data) => {
          expect(data.version).toMatch(/1.0.0/);
          expect(data.dist.tarball).toMatch(/npm_test-1.0.0.tgz/);
          expect(data.name).toMatch(pkgName);
          done();
        });
      });
    });

    test('should add a @scope package', (done) => {
      const metadata = JSON.parse(readMetadata());
      const pkgStoragePath: string = storage._getLocalStorage(pkgNameScoped);

      rimRaf(pkgStoragePath.path, (err) => {
        expect(err).toBeNull();
        storage.addPackage(pkgNameScoped, metadata, (err, data) => {
          expect(data.version).toMatch(/1.0.0/);
          expect(data.dist.tarball).toMatch(/npm_test-1.0.0.tgz/);
          expect(data.name).toMatch(pkgName);
          done();
        });
      });
    });

    test('should fails on add a package', (done) => {
      const metadata = JSON.parse(readMetadata());

      storage.addPackage(pkgName, metadata, (err, data) => {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(409);
        // expect(err.status).toMatch(/this package is already present/);
        done();
      });
    });
  });

  describe('LocalStorage::addVersion', () => {
    test('should add new version without tag', (done) => {
      const metadata = JSON.parse(readMetadata('metadata-add-version'));

      storage.addVersion(pkgName, '1.0.1', metadata, null, (err, data) => {
        expect(err).toBeNull();
        expect(data).toBeUndefined();
        done();
      });
    });

    test('should fails on add a duplicated version without tag', (done) => {
      const metadata = JSON.parse(readMetadata('metadata-add-version'));

      storage.addVersion(pkgName, '1.0.1', metadata, null, (err, data) => {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(409);
        expect(err.message).toMatch(/this package is already present/);
        done();
      });
    });

    test('should add new second version without tag', (done) => {
      const metadata = JSON.parse(readMetadata('metadata-add-version'));

      storage.addVersion(pkgName, '1.0.2', metadata, 'beta', (err, data) => {
        expect(err).toBeNull();
        expect(data).toBeUndefined();
        done();
      });
    });
  });

  describe('LocalStorage::updateVersions', () => {
    test('should update versions from origin', (done) => {
      const metadata = JSON.parse(readMetadata('metadata-update-versions-tags'));

      storage.updateVersions(pkgName, metadata, (err, data) => {
        expect(err).toBeNull();
        expect(data.versions['1.0.3']).toBeDefined();
        done();
      });
    });
  });

  describe('LocalStorage::changePackage', () => {
    test('should unpublish a version', (done) => {
      const metadata = JSON.parse(readMetadata('metadata-unpublish'));
      const rev: string = metadata['_rev'];

      storage.changePackage(pkgName, metadata, rev, (err) => {
        expect(err).toBeUndefined();
        done();
      });
    });
  });

  describe('LocalStorage::addTarball', () => {

    test('should add a new tarball', (done) => {
      const tarballData = JSON.parse(readMetadata('addTarball'));
      const stream = storage.addTarball(pkgName, tarballName);
      stream.on('error', function(err) {
        expect(err).toBeNull();
        done();
      });
      stream.on('success', function() {
        done();
      });

      stream.end(new Buffer(tarballData.data, 'base64'));
      stream.done();
    });

    test('should add a new second tarball', (done) => {
      const tarballData = JSON.parse(readMetadata('addTarball'));
      const stream = storage.addTarball(pkgName, tarballName2);
      stream.on('error', function(err) {
        expect(err).toBeNull();
        done();
      });
      stream.on('success', function() {
        done();
      });

      stream.end(new Buffer(tarballData.data, 'base64'));
      stream.done();
    });

    test('should fails on add a duplicated new tarball ', (done) => {
      const tarballData = JSON.parse(readMetadata('addTarball'));
      const stream = storage.addTarball(pkgName, tarballName);
      stream.on('error', function(err) {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(409);
        expect(err.message).toMatch(/this package is already present/);
        done();
      });

      stream.on('success', function() {
        done();
      });

      stream.end(new Buffer(tarballData.data, 'base64'));
      stream.done();
    });

    test('should fails on add a new tarball on missing package', (done) => {
      const tarballData = JSON.parse(readMetadata('addTarball'));
      const stream = storage.addTarball('unexsiting-package', tarballName);
      stream.on('error', function(err) {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(404);
        expect(err.message).toMatch(/no such package available/);
        done();
      });

      stream.on('success', function() {
        done();
      });

      stream.end(new Buffer(tarballData.data, 'base64'));
      stream.done();
    });

    test('should fails on use invalid package name on add a new tarball', (done) => {
      const stream = storage.addTarball(pkgName, `${pkgName}-fails-add-tarball-1.0.4.tgz`);
      stream.on('error', function(err) {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(422);
        expect(err.message).toMatch(/refusing to accept zero-length file/);
        done();
      });

      stream.done();
    });

    test('should fails on abort on add a new tarball', (done) => {
      const stream = storage.addTarball('package.json', `${pkgName}-fails-add-tarball-1.0.4.tgz`);
      stream.abort();
      stream.on('error', function(err) {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(403);
        expect(err.message).toMatch(/can't use this filename/);
        done();
      });

      stream.done();
    });
  });

  describe('LocalStorage::removeTarball', () => {

    test('should remove a tarball', (done) => {
      storage.removeTarball(pkgName, tarballName2, 'rev', (err, pkg) => {
        expect(err).toBeNull();
        expect(pkg).toBeUndefined();
        done();
      });
    });

    test('should remove a tarball that does not exist', (done) => {
      storage.removeTarball(pkgName, tarballName2, 'rev', (err) => {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(404);
        expect(err.message).toMatch(/no such file available/);
        done();
      });
    });
  });

  describe('LocalStorage::getTarball', () => {
    test('should get a existing tarball', (done) => {
      const stream = storage.getTarball(pkgName, tarballName);
      stream.on('content-length', function(contentLength) {
        expect(contentLength).toBe(279);
        done();
      });
      stream.on('open', function() {
        done();
      });
    });

    test('should fails on get a tarball that does not exist', (done) => {
      const stream = storage.getTarball('fake', tarballName);
      stream.on('error', function(err) {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(404);
        expect(err.message).toMatch(/no such file available/);
        done();
      });
    });
  });

  describe('LocalStorage::search', () => {
    test('should find a tarball', (done) => {
      const stream = storage.search('99999');

      stream.on('data', function each(pkg) {
        expect(pkg.name).toEqual(pkgName);
      });

      stream.on('error', function(err) {
        expect(err).not.toBeNull();
        done();
      });

      stream.on('end', function() {
        done();
      });
    });

  });

  describe('LocalStorage::removePackage', () => {
    test('should remove completely package', (done) => {
      storage.removePackage(pkgName, (err, data) => {
        expect(err).toBeNull();
        expect(data).toBeUndefined();
        done();
      });
    });

    test('should remove completely @scoped package', (done) => {
      storage.removePackage(pkgNameScoped, (err, data) => {
        expect(err).toBeNull();
        expect(data).toBeUndefined();
        done();
      });
    });

    test('should fails with package not found', (done) => {
      const pkgName: string = 'npm_test_fake';
      storage.removePackage(pkgName, (err, data) => {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/no such package available/);
        done();
      });
    });

    test('should fails with @scoped package not found', (done) => {
      storage.removePackage(pkgNameScoped, (err, data) => {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/no such package available/);
        done();
      });
    });
  });

});
