import fs from 'fs';
import path from 'path';

import { addGravatarSupport, parseReadme } from '../src/web-utils';
import { generateGravatarUrl, GENERIC_AVATAR } from '../src/user';

const readmeFile = (fileName = 'markdown.md') => {
  return fs.readFileSync(path.join(__dirname, `./partials/readme/${fileName}`));
};

describe('Utilities', () => {
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

  describe('parseReadme', () => {
    test('should parse makrdown text to html template', () => {
      const markdown = '# markdown';
      expect(parseReadme('testPackage', markdown)).toEqual('<h1 id="markdown">markdown</h1>');
      // @ts-ignore
      expect(parseReadme('testPackage', String(readmeFile('markdown.md')))).toMatchSnapshot();
    });

    test('should pass for conversion of non-ascii to markdown text', () => {
      const simpleText = 'simple text';
      const randomText = '%%%%%**##==';
      const randomTextMarkdown = 'simple text \n # markdown';

      expect(parseReadme('testPackage', randomText)).toEqual('<p>%%%%%**##==</p>');
      expect(parseReadme('testPackage', simpleText)).toEqual('<p>simple text</p>');
      expect(parseReadme('testPackage', randomTextMarkdown)).toEqual(
        '<p>simple text </p>\n<h1 id="markdown">markdown</h1>'
      );
    });

    test('should show error for no readme data', () => {
      const noData = '';
      expect(() => parseReadme('testPackage', noData)).toThrowError('ERROR: No README data found!');
    });
  });
});
