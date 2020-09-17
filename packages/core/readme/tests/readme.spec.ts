import fs from 'fs';
import path from 'path';

import parseReadme from '../src';

function readReadme(project: string, fileName = 'readme.md'): Promise<string> {
  return new Promise((resolve, reject): void => {
    fs.readFile(path.join(__dirname, 'partials', project, fileName), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data.toString());
    });
  });
}

function clean(text: string): string {
  return text.replace(/\n|\r/g, '').trim();
}

describe('readme', () => {
  test('should handle empty readme', () => {
    expect(parseReadme('')).toBeUndefined();
  });

  test('should handle single string readme', () => {
    expect(parseReadme('this is a readme')).toEqual('<p>this is a readme</p>');
  });

  test('should handle wrong text', () => {
    expect(parseReadme(undefined)).toBeUndefined();
  });

  describe('basic parsing', () => {
    test('should parse basic', () => {
      expect(parseReadme('# hi')).toEqual(`<h1 id=\"hi\">hi</h1>`);
    });

    test('should parse basic / js alert', () => {
      expect(parseReadme("[Basic](javascript:alert('Basic'))")).toEqual('<p><a>Basic</a></p>');
    });

    test('should parse basic / local storage', () => {
      expect(
        parseReadme('[Local Storage](javascript:alert(JSON.stringify(localStorage)))')
      ).toEqual('<p><a>Local Storage</a></p>');
    });

    test('should parse basic / case insensitive', () => {
      expect(parseReadme("[CaseInsensitive](JaVaScRiPt:alert('CaseInsensitive'))")).toEqual(
        '<p><a>CaseInsensitive</a></p>'
      );
    });

    test('should parse basic / url', () => {
      expect(parseReadme("[URL](javascript://www.google.com%0Aalert('URL'))")).toEqual(
        '<p><a>URL</a></p>'
      );
    });

    test('should parse basic / in quotes', () => {
      expect(parseReadme('[In Quotes](\'javascript:alert("InQuotes")\')')).toEqual(
        '<p><a href="\'javascript:alert(%22InQuotes%22)\'">In Quotes</a></p>'
      );
    });
  });

  describe('should parse images', () => {
    test('in quotes', () => {
      expect(
        parseReadme(
          '![Escape SRC - onload](https://www.example.com/image.png"onload="alert(\'ImageOnLoad\'))'
        )
      ).toEqual(
        '<p><img alt="Escape SRC - onload" src="https://www.example.com/image.png%22onload=%22alert(\'ImageOnLoad\')"></p>'
      );
    });

    test('in image error', () => {
      expect(parseReadme('![Escape SRC - onerror]("onerror="alert(\'ImageOnError\'))')).toEqual(
        '<p><img alt="Escape SRC - onerror" src="%22onerror=%22alert(\'ImageOnError\')"></p>'
      );
    });
  });

  describe('should test fuzzing', () => {
    test('xss / document cookie', () => {
      expect(parseReadme('[XSS](javascript:prompt(document.cookie))')).toEqual('<p><a>XSS</a></p>');
    });

    test('xss / white space cookie', () => {
      expect(
        parseReadme('[XSS](j    a   v   a   s   c   r   i   p   t:prompt(document.cookie))')
      ).toEqual('<p>[XSS](j    a   v   a   s   c   r   i   p   t:prompt(document.cookie))</p>');
    });

    test('xss / data test/html', () => {
      expect(
        parseReadme('[XSS](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')
      ).toEqual('<p><a>XSS</a></p>');
    });

    test('xss / data test/html encoded', () => {
      expect(
        parseReadme(
          '[XSS](&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29)'
        )
      ).toEqual(
        '<p><a href="&amp;#x6A&amp;#x61&amp;#x76&amp;#x61&amp;#x73&amp;#x63&amp;#x72&amp;#x69&amp;#x70&amp;#x74&amp;#x3A&amp;#x61&amp;#x6C&amp;#x65&amp;#x72&amp;#x74&amp;#x28&amp;#x27&amp;#x58&amp;#x53&amp;#x53&amp;#x27&amp;#x29">XSS</a></p>'
      );
    });

    test('xss / js prompt', () => {
      expect(parseReadme('[XSS]: (javascript:prompt(document.cookie))')).toEqual('');
    });

    test('xss / js window error alert', () => {
      expect(parseReadme('[XSS](javascript:window.onerror=alert;throw%20document.cookie)')).toEqual(
        '<p><a>XSS</a></p>'
      );
    });

    test('xss / js window encoded prompt', () => {
      expect(parseReadme('[XSS](javascript://%0d%0aprompt(1))')).toEqual('<p><a>XSS</a></p>');
    });

    test('xss / js window encoded prompt multiple statement', () => {
      expect(parseReadme('[XSS](javascript://%0d%0aprompt(1);com)')).toEqual('<p><a>XSS</a></p>');
    });

    test('xss / js window encoded window error alert multiple statement', () => {
      expect(parseReadme('[XSS](javascript:window.onerror=alert;throw%20document.cookie)')).toEqual(
        '<p><a>XSS</a></p>'
      );
    });

    test('xss / js window encoded window error alert throw error', () => {
      expect(
        parseReadme('[XSS](javascript://%0d%0awindow.onerror=alert;throw%20document.cookie)')
      ).toEqual('<p><a>XSS</a></p>');
    });

    test('xss / js window encoded data text/html base 64', () => {
      expect(
        parseReadme('[XSS](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')
      ).toEqual('<p><a>XSS</a></p>');
    });

    test('xss / js vbscript alert', () => {
      expect(parseReadme('[XSS](vbscript:alert(document.domain))')).toEqual('<p><a>XSS</a></p>');
    });

    describe('xss / js alert this', () => {
      test('xss / js case #1', () => {
        expect(parseReadme('[XSS](javascript:this;alert(1))')).toEqual('<p><a>XSS</a></p>');
      });

      test('xss / js case #2', () => {
        expect(parseReadme('[XSS](javascript:this;alert(1&#41;)')).toEqual('<p><a>XSS</a></p>');
      });

      test('xss / js case #3', () => {
        expect(parseReadme('[XSS](javascript&#58this;alert(1&#41;)')).toEqual('<p><a>XSS</a></p>');
      });

      test('xss / js case #4', () => {
        expect(parseReadme('[XSS](Javas&#99;ript:alert(1&#41;)')).toEqual('<p><a>XSS</a></p>');
      });

      test('xss / js case #5', () => {
        expect(parseReadme('[XSS](Javas%26%2399;ript:alert(1&#41;)')).toEqual(
          '<p><a href="Javas%26%2399;ript:alert(1)">XSS</a></p>'
        );
      });

      test('xss / js case #6', () => {
        expect(parseReadme('[XSS](javascript:alert&#65534;(1&#41;)')).toEqual('<p><a>XSS</a></p>');
      });
    });

    test('xss / js confirm', () => {
      expect(parseReadme('[XSS](javascript:confirm(1)')).toEqual('<p><a>XSS</a></p>');
    });

    describe('xss / js url', () => {
      test('xss / case #1', () => {
        expect(parseReadme('[XSS](javascript://www.google.com%0Aprompt(1))')).toEqual(
          '<p><a>XSS</a></p>'
        );
      });

      test('xss / case #2', () => {
        expect(parseReadme('[XSS](javascript://%0d%0aconfirm(1);com)')).toEqual(
          '<p><a>XSS</a></p>'
        );
      });

      test('xss / case #3', () => {
        expect(parseReadme('[XSS](javascript:window.onerror=confirm;throw%201)')).toEqual(
          '<p><a>XSS</a></p>'
        );
      });

      test('xss / case #4', () => {
        expect(parseReadme('[XSS](�javascript:alert(document.domain&#41;)')).toEqual(
          '<p><a href="%EF%BF%BDjavascript:alert(document.domain)">XSS</a></p>'
        );
      });

      test('xss / case #5', () => {
        expect(parseReadme('![XSS](javascript:prompt(document.cookie))\\')).toEqual(
          '<p><img alt="XSS">\\</p>'
        );
      });

      test('xss / case #6', () => {
        expect(
          parseReadme('![XSS](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)\\')
        ).toEqual(
          '<p><img alt="XSS" src="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">\\</p>'
        );
      });

      // FIXME: requires proper parsing
      test.skip('xss / case #7', () => {
        expect(parseReadme(`![XSS'"\`onerror=prompt(document.cookie)](x)\\`)).toEqual(
          '<p>![XSS\'\\"`onerror=prompt(document.cookie)](x)\\\\</p>'
        );
      });
    });
  });

  describe('mix readmes / markdown', () => {
    test('should parse marked', async () => {
      const readme: string = await readReadme('mixed-html-mk');

      expect(clean(parseReadme(readme) as string)).toMatchInlineSnapshot(
        `"<h1 id=\\"mix-html-and-xss-markdown\\">mix html and XSS markdown</h1><p><a>Basic</a></p><p><a href=\\"https://github.com/webpack/webpack\\"><img src=\\"https://webpack.js.org/assets/icon-square-big.svg\\" height=\\"200\\" width=\\"200\\"></a></p>"`
      );
    });
  });
});
