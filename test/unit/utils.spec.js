// @flow
import assert from 'assert';
import {validateName as validate, convertDistRemoteToLocalTarballUrls}  from '../../src/lib/utils';
import {generateGravatarUrl, GRAVATAR_DEFAULT}  from '../../src/utils/user';
import {spliceURL}  from '../../src/utils/string';
import Package from "../../src/webui/src/components/Package";

describe('Utilities', () => {

  describe('String utilities', () => {
    test('should splice two strings and generate a url', () => {
      const url: string = spliceURL('http://domain.com', '/-/static/logo.png');

      expect(url).toMatch('http://domain.com/-/static/logo.png');
    });

    test('should splice a empty strings and generate a url', () => {
      const url: string = spliceURL('', '/-/static/logo.png');

      expect(url).toMatch('/-/static/logo.png');
    });
  });

  describe('User utilities', () => {
      test('should generate gravatar url with email', () => {
        const gravatarUrl: string = generateGravatarUrl('user@verdaccio.org');

        expect(gravatarUrl).toMatch('https://www.gravatar.com/avatar/');
        expect(gravatarUrl).not.toMatch('000000000');
      });

      test('should generate generic gravatar url', () => {
        const gravatarUrl: string = generateGravatarUrl();

        expect(gravatarUrl).toMatch(GRAVATAR_DEFAULT);
      });
  });

  describe('Validations', () => {
    test('good ones', () => {
      assert( validate('verdaccio') );
      assert( validate('some.weird.package-zzz') );
      assert( validate('old-package@0.1.2.tgz') );
    });

    test('uppercase', () => {
      assert( validate('EVE') );
      assert( validate('JSONStream') );
    });

    test('no package.json', () => {
      assert( !validate('package.json') );
    });

    test('no path seps', () => {
      assert( !validate('some/thing') );
      assert( !validate('some\\thing') );
    });

    test('no hidden', () => {
      assert( !validate('.bin') );
    });

    test('no reserved', () => {
      assert( !validate('favicon.ico') );
      assert( !validate('node_modules') );
      assert( !validate('__proto__') );
    });

    test('other', () => {
      assert( !validate('pk g') );
      assert( !validate('pk\tg') );
      assert( !validate('pk%20g') );
      assert( !validate('pk+g') );
      assert( !validate('pk:g') );
    });
  });

  describe('Packages utilities', () => {
    const metadata: Package = {
      "name": "npm_test",
      "versions": {
        "1.0.0": {
          "dist": {
            "tarball": "http:\/\/registry.org\/npm_test\/-\/npm_test-1.0.0.tgz"
          }
        },
        "1.0.1": {
          "dist": {
            "tarball": "http:\/\/registry.org\/npm_test\/-\/npm_test-1.0.1.tgz"
          }
        }
      },
    };

    const buildURI = (host, version) => `http://${host}/npm_test/-/npm_test-${version}.tgz`;
    const host = 'fake.com';

    test('convertDistRemoteToLocalTarballUrls', () => {
      // $FlowFixMe
      const convertDist = convertDistRemoteToLocalTarballUrls(Object.assign({}, metadata), {
        headers: {
          host,
        },
        get: ()=> 'http',
        protocol: 'http'
      }, '');

      expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(buildURI(host, '1.0.0'));
      expect(convertDist.versions['1.0.1'].dist.tarball).toEqual(buildURI(host, '1.0.1'));
    });
  });
});
