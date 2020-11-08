import { spliceURL } from '../src/string';

describe('spliceURL', () => {
  test('should splice two strings and generate a url', () => {
    const url: string = spliceURL('http://domain.com', '/-/static/logo.png');

    expect(url).toMatch('http://domain.com/-/static/logo.png');
  });

  test('should splice a empty strings and generate a url', () => {
    const url: string = spliceURL('', '/-/static/logo.png');

    expect(url).toMatch('/-/static/logo.png');
  });
});
