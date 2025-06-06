import { describe, expect, test } from 'vitest';

import { DEFAULT_USER } from '@verdaccio/core';

import {
  GENERIC_AVATAR,
  addGravatarSupport,
  formatAuthor,
  generateGravatarUrl,
} from '../src/index';

describe('Utilities', () => {
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
      // @ts-expect-error
      expect(formatAuthor(null).name).toEqual(DEFAULT_USER);
      // @ts-expect-error
      expect(formatAuthor({}).name).toEqual(DEFAULT_USER);
      // @ts-expect-error
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
            name: 'user@verdccio.org',
            _avatar: GENERIC_AVATAR,
            email: '',
            url: '',
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
            _avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
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
                _avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
                email: 'user@verdccio.org',
                name: 'user',
              },
              {
                _avatar: 'https://www.gravatar.com/avatar/51105a49ce4a9c2bfabf0f6a2cba3762',
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
                _avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
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
                _avatar: 'https://www.gravatar.com/avatar/35e29ca04b2225aaf1dd91242fcfeb2e',
                email: 'b@rubble.com',
                name: 'Barney Rubble',
                url: 'http://barnyrubble.tumblr.com/',
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
              _avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
              email: 'user@verdccio.org',
              name: 'user',
            },
            {
              _avatar: 'https://www.gravatar.com/avatar/51105a49ce4a9c2bfabf0f6a2cba3762',
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
