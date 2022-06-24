import fs from 'fs';
import path from 'path';

import { parseReadme, validatePrimaryColor } from '../src/utils/web-utils';

const readmeFile = (fileName = 'markdown.md') => {
  return fs.readFileSync(path.join(__dirname, `./partials/readme/${fileName}`));
};

describe('Utilities', () => {
  describe('validatePrimaryColor', () => {
    test('is valid', () => {
      expect(validatePrimaryColor('#222222')).toEqual('#222222');
      expect(validatePrimaryColor('#222fff')).toEqual('#222fff');
    });
    test('is invalid', () => {
      expect(validatePrimaryColor('fff')).toBeUndefined();
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
