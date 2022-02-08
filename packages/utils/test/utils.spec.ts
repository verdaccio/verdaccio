import { DEFAULT_USER, DIST_TAGS } from '@verdaccio/core';

import {
  GENERIC_AVATAR,
  addGravatarSupport,
  formatAuthor,
  generateGravatarUrl,
  normalizeDistTags,
  validateMetadata,
} from '../src/index';

describe('Utilities', () => {
  const metadata: any = {
    name: 'npm_test',
    versions: {
      '1.0.0': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.0.tgz',
        },
      },
      '1.0.1': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.1.tgz',
        },
      },
    },
  };

  const cloneMetadata = (pkg = metadata) => Object.assign({}, pkg);

  describe('API utilities', () => {
    describe('normalizeDistTags', () => {
      test('should delete a invalid latest version', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: '20000',
        };

        normalizeDistTags(pkg);

        expect(Object.keys(pkg[DIST_TAGS])).toHaveLength(0);
      });

      test('should define last published version as latest', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {};

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      });

      test('should define last published version as latest with a custom dist-tag', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          beta: '1.0.1',
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ beta: '1.0.1', latest: '1.0.1' });
      });

      test('should convert any array of dist-tags to a plain string', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: ['1.0.1'],
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      });
    });

    describe('validateMetadata', () => {
      test('should fills an empty metadata object', () => {
        // intended to fail with flow, do not remove
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain(DIST_TAGS);
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain('versions');
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain('time');
      });

      test('should fails the assertions is not an object', () => {
        expect(function () {
          // @ts-ignore
          validateMetadata('');
          // @ts-ignore
        }).toThrow(expect.hasAssertions());
      });

      test('should fails the assertions is name does not match', () => {
        expect(function () {
          // @ts-ignore
          validateMetadata({}, 'no-name');
          // @ts-ignore
        }).toThrow(expect.hasAssertions());
      });
    });

    describe('formatAuthor', () => {
      test('should check author field different values', () => {
        const author = 'verdaccioNpm';
        expect(formatAuthor(author).name).toEqual(author);
      });
      test('should check author field for object value', () => {
        const user = {
          name: 'Verdaccion NPM',
          email: 'verdaccio@verdaccio.org',
          url: 'https://verdaccio.org',
        };
        expect(formatAuthor(user).url).toEqual(user.url);
        expect(formatAuthor(user).email).toEqual(user.email);
        expect(formatAuthor(user).name).toEqual(user.name);
      });
      test('should check author field for other value', () => {
        expect(formatAuthor(null).name).toEqual(DEFAULT_USER);
        expect(formatAuthor({}).name).toEqual(DEFAULT_USER);
        expect(formatAuthor([]).name).toEqual(DEFAULT_USER);
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

        expect(gravatarUrl).toMatch(GENERIC_AVATAR);
      });
    });

    describe('addGravatarSupport', () => {
      test('check for blank object', () => {
        // @ts-ignore
        expect(addGravatarSupport({})).toEqual({});
      });

      test('author, contributors and maintainers fields are not present', () => {
        const packageInfo = {
          latest: {},
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
      });

      test('author field is a blank object', () => {
        const packageInfo = { latest: { author: {} } };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
      });

      test('author field is a string type', () => {
        const packageInfo = {
          latest: { author: 'user@verdccio.org' },
        };
        const result = {
          latest: {
            author: {
              author: 'user@verdccio.org',
              avatar: GENERIC_AVATAR,
              email: '',
            },
          },
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(result);
      });

      test('author field is an object type with author information', () => {
        const packageInfo = {
          latest: { author: { name: 'verdaccio', email: 'user@verdccio.org' } },
        };
        const result = {
          latest: {
            author: {
              avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
              email: 'user@verdccio.org',
              name: 'verdaccio',
            },
          },
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(result);
      });

      test('contributor field is a blank array', () => {
        const packageInfo = {
          latest: {
            contributors: [],
          },
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
      });

      describe('contributors', () => {
        test('contributors field has contributors', () => {
          const packageInfo = {
            latest: {
              contributors: [
                { name: 'user', email: 'user@verdccio.org' },
                { name: 'user1', email: 'user1@verdccio.org' },
              ],
            },
          };

          const result = {
            latest: {
              contributors: [
                {
                  avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
                  email: 'user@verdccio.org',
                  name: 'user',
                },
                {
                  avatar: 'https://www.gravatar.com/avatar/51105a49ce4a9c2bfabf0f6a2cba3762',
                  email: 'user1@verdccio.org',
                  name: 'user1',
                },
              ],
            },
          };

          // @ts-ignore
          expect(addGravatarSupport(packageInfo)).toEqual(result);
        });

        test('contributors field is an object', () => {
          const packageInfo = {
            latest: {
              contributors: { name: 'user', email: 'user@verdccio.org' },
            },
          };

          const result = {
            latest: {
              contributors: [
                {
                  avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
                  email: 'user@verdccio.org',
                  name: 'user',
                },
              ],
            },
          };

          // @ts-ignore
          expect(addGravatarSupport(packageInfo)).toEqual(result);
        });

        test('contributors field is a string', () => {
          const contributor = 'Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)';
          const packageInfo = {
            latest: {
              contributors: contributor,
            },
          };

          const result = {
            latest: {
              contributors: [
                {
                  avatar: GENERIC_AVATAR,
                  email: contributor,
                  name: contributor,
                },
              ],
            },
          };

          // @ts-ignore
          expect(addGravatarSupport(packageInfo)).toEqual(result);
        });
      });

      test('maintainers field is a blank array', () => {
        const packageInfo = {
          latest: {
            maintainers: [],
          },
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
      });

      test('maintainers field has maintainers', () => {
        const packageInfo = {
          latest: {
            maintainers: [
              { name: 'user', email: 'user@verdccio.org' },
              { name: 'user1', email: 'user1@verdccio.org' },
            ],
          },
        };

        const result = {
          latest: {
            maintainers: [
              {
                avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
                email: 'user@verdccio.org',
                name: 'user',
              },
              {
                avatar: 'https://www.gravatar.com/avatar/51105a49ce4a9c2bfabf0f6a2cba3762',
                email: 'user1@verdccio.org',
                name: 'user1',
              },
            ],
          },
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(result);
      });
    });
  });
});
