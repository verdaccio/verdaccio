import supertest from 'supertest';

import { DIST_TAGS, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';

import { initializeServer, initializeServerWithConfig, getConf, publishVersion } from './_helper';

describe('experiments', () => {

  describe('for a function value of tarball_url_redirect', () => {
    let app;
    beforeEach(async () => {
      const baseTestConfig = getConf('experiments.yaml');
      app = await initializeServerWithConfig({
        ...baseTestConfig,
        experiments: {
          // @ts-ignore
          tarball_url_redirect(context) {
            return `https://myapp.sfo1.mycdn.com/verdaccio/${context.packageName}/${context.filename}`;
          },
        },
      });
      await publishVersion(app, '@tarball_tester/testTarballPackage', '1.0.0');
      await publishVersion(app, 'testTarballPackage', '1.0.0');
    });

    test('should redirect for package tarball as function', (done) => {
      supertest(app)
        .get('/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
        .expect(302)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.headers.location).toEqual(
            'https://myapp.sfo1.mycdn.com/verdaccio/testTarballPackage/testTarballPackage-1.0.0.tgz'
          );
          done();
        });

        
    });

    test('should redirect for scoped package tarball', (done) => {
      supertest(app)
        .get('/@tarball_tester/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
        .expect(302)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.headers.location).toEqual(
            'https://myapp.sfo1.mycdn.com/verdaccio/@tarball_tester/testTarballPackage/testTarballPackage-1.0.0.tgz'
          );
          done();
        });
    });
   
  });
  describe('for a async function value of tarball_url_redirect', () => {
    let app;
    beforeEach(async () => {
      const baseTestConfig = getConf('experiments.yaml');
      app = await initializeServerWithConfig({
        ...baseTestConfig,
        experiments: {
          // @ts-ignore
          async tarball_url_redirect(context) {
            await new Promise((resolve) => {
              setTimeout(resolve, 1000);
            });
            return `https://myapp.sfo1.mycdn.com/verdaccio/${context.packageName}/${context.filename}`;
          },
        },
      });
      await publishVersion(app, '@tarball_tester/testTarballPackage', '1.0.0');
      await publishVersion(app, 'testTarballPackage', '1.0.0');
    });

    test('should redirect for package tarball', (done) => {
      supertest(app)
        .get('/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
        .expect(302)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.headers.location).toEqual(
            'https://myapp.sfo1.mycdn.com/verdaccio/testTarballPackage/testTarballPackage-1.0.0.tgz'
          );
          done();
        });     
    });

    test('should redirect for scoped package tarball', (done) => {
      supertest(app)
        .get('/@tarball_tester/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
        .expect(302)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.headers.location).toEqual(
            'https://myapp.sfo1.mycdn.com/verdaccio/@tarball_tester/testTarballPackage/testTarballPackage-1.0.0.tgz'
          );
          done();
        });
    });
   
  });
  describe('for a string value of tarball_url_redirect', () => {
    let app;
    beforeEach(async () => {
      const baseTestConfig = getConf('experiments.yaml');
      app = await initializeServerWithConfig({
        ...baseTestConfig,
        experiments: {
          // @ts-ignore
          tarball_url_redirect: 'https://myapp.sfo1.mycdn.com/verdaccio/${packageName}/${filename}',
        },
      });
      await publishVersion(app, '@tarball_tester/testTarballPackage', '1.0.0');
      await publishVersion(app, 'testTarballPackage', '1.0.0');
    });

    test('should redirect for scoped package tarball', (done) => {
      supertest(app)
        .get('/@tarball_tester/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
        .expect(302)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.headers.location).toEqual(
            'https://myapp.sfo1.mycdn.com/verdaccio/@tarball_tester/testTarballPackage/testTarballPackage-1.0.0.tgz'
          );
          done();
        });
    });

    test('should redirect for package tarball', (done) => {
      supertest(app)
        .get('/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
        .expect(302)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.headers.location).toEqual(
            'https://myapp.sfo1.mycdn.com/verdaccio/testTarballPackage/testTarballPackage-1.0.0.tgz'
          );
          done();
        });
    });

  })
});
