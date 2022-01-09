import _ from 'lodash';

import { DEFAULT_DOMAIN, DEFAULT_PORT } from '../../../../src/lib/constants';
import { parseAddress as parse } from '../../../../src/lib/utils';

describe('Parse listen address', () => {
  const useCases: any[] = [];

  function addTest(uri: string, proto: string | null, host?: string, port?: string) {
    useCases.push([uri, proto, host, port]);
  }

  addTest(DEFAULT_PORT, 'http', DEFAULT_DOMAIN, DEFAULT_PORT);
  addTest(':4873', 'http', DEFAULT_DOMAIN, DEFAULT_PORT);
  addTest('blah:4873', 'http', 'blah', DEFAULT_PORT);
  addTest('http://:4873', 'http', DEFAULT_DOMAIN, DEFAULT_PORT);
  addTest('https::4873', 'https', DEFAULT_DOMAIN, DEFAULT_PORT);
  addTest('https:blah:4873', 'https', 'blah', DEFAULT_PORT);
  addTest('https://blah:4873/', 'https', 'blah', DEFAULT_PORT);
  addTest('[::1]:4873', 'http', '::1', DEFAULT_PORT);
  addTest('https:[::1]:4873', 'https', '::1', DEFAULT_PORT);

  addTest('unix:/tmp/foo.sock', 'http', '/tmp/foo.sock');
  addTest('http:unix:foo.sock', 'http', 'foo.sock');
  addTest('https://unix:foo.sock', 'https', 'foo.sock');
  addTest('https://unix:foo.sock:34', 'https', 'foo.sock:34');
  addTest('http://foo.sock:34', 'http', 'foo.sock', '34');

  addTest('blah', null);
  addTest('blah://4873', null);
  addTest('https://blah:4873///', null);
  addTest('unix:1234', 'http', 'unix', '1234'); // not unix socket

  test.each(useCases)(`should parse (%s - %s - %s - %s)`, (uri, proto, host, port) => {
    const parsed = parse(uri);

    if (_.isNull(proto)) {
      expect(parsed).toBeNull();
    } else if (port) {
      expect(parsed).toEqual({
        proto,
        host,
        port,
      });
    } else {
      expect(parsed).toEqual({
        proto,
        path: host,
      });
    }
  });
});
