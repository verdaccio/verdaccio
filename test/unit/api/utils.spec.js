// @flow
import assert from 'assert';
import { generateGravatarUrl, GRAVATAR_DEFAULT } from '../../../src/utils/user';
import { spliceURL } from '../../../src/utils/string';
import Package from '../../../src/webui/components/Package/index';
import {
  validateName,
  convertDistRemoteToLocalTarballUrls,
  parseReadme,
  addGravatarSupport, validatePackage, validateMetadata, DIST_TAGS, combineBaseUrl, getVersion, normalizeDistTags
} from '../../../src/lib/utils';
import Logger, { setup } from '../../../src/lib/logger';
import { readFile } from '../../functional/lib/test.utils';

const readmeFile = (fileName: string = 'markdown.md') =>
  readFile(`../../unit/partials/readme/${fileName}`);

setup([]);

describe('Utilities', () => {
  const buildURI = (host, version) =>
    `http://${host}/npm_test/-/npm_test-${version}.tgz`;
  const fakeHost = 'fake.com';
  const metadata: Package = {
    name: 'npm_test',
    versions: {
      '1.0.0': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.0.tgz'
        }
      },
      '1.0.1': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.1.tgz'
        }
      }
    }
  };
  const cloneMetadata = (pkg = metadata) => Object.assign({}, pkg);

  describe('API utilities', () => {
    describe('convertDistRemoteToLocalTarballUrls', () => {
      test('should build a URI for dist tarball based on new domain', () => {
        const convertDist = convertDistRemoteToLocalTarballUrls(cloneMetadata(),
          // $FlowFixMe
          {
            headers: {
              host: fakeHost
            },
            get: () => 'http',
            protocol: 'http'
          });
        expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(buildURI(fakeHost, '1.0.0'));
        expect(convertDist.versions['1.0.1'].dist.tarball).toEqual(buildURI(fakeHost, '1.0.1'));
      });

      test('should return same URI whether host is missing', () => {
        const convertDist = convertDistRemoteToLocalTarballUrls(cloneMetadata(),
          // $FlowFixMe
          {
            headers: {},
            get: () => 'http',
            protocol: 'http'
          });
        expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(convertDist.versions['1.0.0'].dist.tarball);
      });
    });

    describe('normalizeDistTags', () => {
      test('should delete a invalid latest version', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: '20000'
        };

        normalizeDistTags(pkg)

        expect(Object.keys(pkg[DIST_TAGS])).toHaveLength(0);
      });

      test('should define last published version as latest', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {};

        normalizeDistTags(pkg)

        expect(pkg[DIST_TAGS]).toEqual({latest: '1.0.1'});
      });

      test('should define last published version as latest with a custom dist-tag', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          beta: '1.0.1'
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({beta: '1.0.1', latest: '1.0.1'});
      });

      test('should convert any array of dist-tags to a plain string', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: ['1.0.1']
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({latest: '1.0.1'});
      });
    });

    describe('getVersion', () => {
      test('should get the right version', () => {
        expect(getVersion(cloneMetadata(), '1.0.0')).toEqual(metadata.versions['1.0.0']);
        expect(getVersion(cloneMetadata(), 'v1.0.0')).toEqual(metadata.versions['1.0.0']);
      });

      test('should return nothing on get non existing version', () => {
        expect(getVersion(cloneMetadata(), '0')).toBeUndefined();
        expect(getVersion(cloneMetadata(), '2.0.0')).toBeUndefined();
        expect(getVersion(cloneMetadata(), 'v2.0.0')).toBeUndefined();
        expect(getVersion(cloneMetadata(), undefined)).toBeUndefined();
        expect(getVersion(cloneMetadata(), null)).toBeUndefined();
        expect(getVersion(cloneMetadata(), 2)).toBeUndefined();
      })
    });

    describe('combineBaseUrl', () => {
      test('should create a URI', () => {
        expect(combineBaseUrl("http", 'domain')).toEqual('http://domain');
      });

      test('should create a base url for registry', () => {
        expect(combineBaseUrl("http", 'domain', '/prefix/')).toEqual('http://domain/prefix');
        expect(combineBaseUrl("http", 'domain', 'only-prefix')).toEqual('only-prefix');
      });

    });

    describe('validatePackage', () => {
      test('should validate package names', () => {
        expect(validatePackage("package-name")).toBeTruthy();
        expect(validatePackage("@scope/package-name")).toBeTruthy();
      });

      test('should fails on validate package names', () => {
        expect(validatePackage("package-name/test/fake")).toBeFalsy();
        expect(validatePackage("@/package-name")).toBeFalsy();
        expect(validatePackage("$%$%#$%$#%#$%$#")).toBeFalsy();
        expect(validatePackage("node_modules")).toBeFalsy();
        expect(validatePackage("__proto__")).toBeFalsy();
        expect(validatePackage("package.json")).toBeFalsy();
        expect(validatePackage("favicon.ico")).toBeFalsy();
      });

      describe('validateName', () => {
        test('should fails with no string', () => {
          // intended to fail with flow, do not remove
          // $FlowFixMe
          expect(validateName(null)).toBeFalsy();
          // $FlowFixMe
          expect(validateName()).toBeFalsy();
        });

        test('good ones', () => {
          expect(validateName('verdaccio')).toBeTruthy();
          expect(validateName('some.weird.package-zzz')).toBeTruthy();
          expect(validateName('old-package@0.1.2.tgz')).toBeTruthy();
        });

        test('should be valid using uppercase', () => {
          expect(validateName('ETE')).toBeTruthy();
          expect(validateName('JSONStream')).toBeTruthy();
        });

        test('should fails using package.json', () => {
          expect(validateName('package.json')).toBeFalsy();
        });

        test('should fails with path seps', () => {
          expect(validateName('some/thing')).toBeFalsy();
          expect(validateName('some\\thing')).toBeFalsy();
        });

        test('should fail with no hidden files', () => {
          expect(validateName('.bin')).toBeFalsy();
        });

        test('should fails with reserved words', () => {
          expect(validateName('favicon.ico')).toBeFalsy();
          expect(validateName('node_modules')).toBeFalsy();
          expect(validateName('__proto__')).toBeFalsy();
        });

        test('should fails with other options', () => {
          expect(validateName('pk g')).toBeFalsy();
          expect(validateName('pk\tg')).toBeFalsy();
          expect(validateName('pk%20g')).toBeFalsy();
          expect(validateName('pk+g')).toBeFalsy();
          expect(validateName('pk:g')).toBeFalsy();
        });
      });
    });

    describe('validateMetadata', () => {
      test('should fills an empty metadata object', () => {
        // intended to fail with flow, do not remove
        // $FlowFixMe
        expect(Object.keys(validateMetadata({}))).toContain(DIST_TAGS);
        // $FlowFixMe
        expect(Object.keys(validateMetadata({}))).toContain('versions');
        // $FlowFixMe
        expect(Object.keys(validateMetadata({}))).toContain('time');
      });

      test('should fails the assertions is not an object', () => {
        expect(function ( ) {
          // $FlowFixMe
          validateMetadata('');
        }).toThrow(assert.AssertionError);
      });

      test('should fails the assertions is name does not match', () => {
        expect(function ( ) {
          // $FlowFixMe
          validateMetadata({}, "no-name");
        }).toThrow(assert.AssertionError);
      });
    });
  });

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

  describe('parseReadme', () => {
    test('should parse makrdown text to html template', () => {
      const markdown = '# markdown';
      expect(parseReadme('testPackage', markdown)).toEqual(
        '<h1 id="markdown">markdown</h1>\n'
      );
      expect(
        parseReadme('testPackage', String(readmeFile('markdown.md')))
      ).toMatchSnapshot();
    });

    test('should pass for conversion of non-ascii to markdown text', () => {
      const simpleText = 'simple text';
      const randomText = '%%%%%**##==';
      const randomTextMarkdown = 'simple text \n # markdown';

      expect(parseReadme('testPackage', randomText)).toEqual(
        '<p>%%%%%**##==</p>\n'
      );
      expect(parseReadme('testPackage', simpleText)).toEqual(
        '<p>simple text</p>\n'
      );
      expect(parseReadme('testPackage', randomTextMarkdown)).toEqual(
        '<p>simple text </p>\n<h1 id="markdown">markdown</h1>\n'
      );
    });

    test('should show error for no readme data', () => {
      const noData = '';
      const spy = jest.spyOn(Logger.logger, 'error');
      expect(parseReadme('testPackage', noData)).toEqual(
        '<p>ERROR: No README data found!</p>\n'
      );
      expect(spy).toHaveBeenCalledWith(
        { packageName: 'testPackage' },
        '@{packageName}: No readme found'
      );
    });
  });

  describe('addGravatarSupport', () => {
    test('check for blank object', () => {
      expect(addGravatarSupport({})).toEqual({});
    });

    test('author, contributors and maintainers fields are not present', () => {
      const packageInfo = {
        latest: {}
      };
      expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
    });

    test('author field is a blank object', () => {
      const packageInfo = { latest: { author: {} } };
      expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
    });

    test('author field is a string type', () => {
      const packageInfo = {
        latest: { author: 'user@verdccio.org' }
      };
      const result = {
        latest: {
          author: {
            author: 'user@verdccio.org',
            avatar:
              'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm',
            email: ''
          }
        }
      };
      expect(addGravatarSupport(packageInfo)).toEqual(result);
    });

    test('author field is an object type with author information', () => {
      const packageInfo = {
        latest: { author: { name: 'verdaccio', email: 'user@verdccio.org' } }
      };
      const result = {
        latest: {
          author: {
            avatar:
              'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
            email: 'user@verdccio.org',
            name: 'verdaccio'
          }
        }
      };
      expect(addGravatarSupport(packageInfo)).toEqual(result);
    });

    test('contributor field is a blank array', () => {
      const packageInfo = {
        latest: {
          contributors: []
        }
      };
      expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
    });

    test('contributors field has contributors', () => {
      const packageInfo = {
        latest: {
          contributors: [
            { name: 'user', email: 'user@verdccio.org' },
            { name: 'user1', email: 'user1@verdccio.org' }
          ]
        }
      };

      const result = {
        latest: {
          contributors: [
            {
              avatar:
                'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
              email: 'user@verdccio.org',
              name: 'user'
            },
            {
              avatar:
                'https://www.gravatar.com/avatar/51105a49ce4a9c2bfabf0f6a2cba3762',
              email: 'user1@verdccio.org',
              name: 'user1'
            }
          ]
        }
      };
      expect(addGravatarSupport(packageInfo)).toEqual(result);
    });

    test('maintainers field is a blank array', () => {
      const packageInfo = {
        latest: {
          maintainers: []
        }
      };
      expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
    });

    test('maintainers field has maintainers', () => {
      const packageInfo = {
        latest: {
          maintainers: [
            { name: 'user', email: 'user@verdccio.org' },
            { name: 'user1', email: 'user1@verdccio.org' }
          ]
        }
      };

      const result = {
        latest: {
          maintainers: [
            {
              avatar:
                'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
              email: 'user@verdccio.org',
              name: 'user'
            },
            {
              avatar:
                'https://www.gravatar.com/avatar/51105a49ce4a9c2bfabf0f6a2cba3762',
              email: 'user1@verdccio.org',
              name: 'user1'
            }
          ]
        }
      };
      expect(addGravatarSupport(packageInfo)).toEqual(result);
    });
  });
});
