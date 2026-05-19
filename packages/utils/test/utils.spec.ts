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
        latest: { author: 'user@fake.verdaccio.org' },
      };
      const result = {
        latest: {
          author: {
            author: 'user@fake.verdaccio.org',
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
        latest: { author: { name: 'verdaccio', email: 'user@fake.verdaccio.org' } },
      };
      const result = {
        latest: {
          author: {
            avatar: 'https://www.gravatar.com/avatar/11b17b4f48ccd0870ab349fbea070d6a',
            email: 'user@fake.verdaccio.org',
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
              { name: 'user', email: 'user@fake.verdaccio.org' },
              { name: 'user1', email: 'user1@fake.verdaccio.org' },
            ],
          },
        };

        const result = {
          latest: {
            contributors: [
              {
                avatar: 'https://www.gravatar.com/avatar/11b17b4f48ccd0870ab349fbea070d6a',
                email: 'user@fake.verdaccio.org',
                name: 'user',
              },
              {
                avatar: 'https://www.gravatar.com/avatar/952dcd0755f8f620945bc05c77e3b737',
                email: 'user1@fake.verdaccio.org',
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
            contributors: { name: 'user', email: 'user@fake.verdaccio.org' },
          },
        };

        const result = {
          latest: {
            contributors: [
              {
                avatar: 'https://www.gravatar.com/avatar/11b17b4f48ccd0870ab349fbea070d6a',
                email: 'user@fake.verdaccio.org',
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
            { name: 'user', email: 'user@fake.verdaccio.org' },
            { name: 'user1', email: 'user1@fake.verdaccio.org' },
          ],
        },
      };

      const result = {
        latest: {
          maintainers: [
            {
              avatar: 'https://www.gravatar.com/avatar/11b17b4f48ccd0870ab349fbea070d6a',
              email: 'user@fake.verdaccio.org',
              name: 'user',
            },
            {
              avatar: 'https://www.gravatar.com/avatar/952dcd0755f8f620945bc05c77e3b737',
              email: 'user1@fake.verdaccio.org',
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
