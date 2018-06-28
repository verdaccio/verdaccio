import _ from 'lodash';
import {parse_address as parse} from '../../../src/lib/utils';

describe('Parse listen address', () => {
  function addTest(uri, proto, host, port) {
    test(uri, () => {
      if (_.isNull(proto)) {
        expect(parse(uri)).toBeNull();
      } else if (port) {
        expect(parse(uri)).toEqual({
          proto,
          host,
          port,
        });
      } else {
        expect(parse(uri)).toEqual({
          proto,
          host,
        });
      }
    });
  }

  addTest('4873', 'http', 'localhost', '4873');
  addTest(':4873', 'http', 'localhost', '4873');
  addTest('blah:4873', 'http', 'blah', '4873');
  addTest('http://:4873', 'http', 'localhost', '4873');
  addTest('https::4873', 'https', 'localhost', '4873');
  addTest('https:blah:4873', 'https', 'blah', '4873');
  addTest('https://blah:4873/', 'https', 'blah', '4873');
  addTest('[::1]:4873', 'http', '::1', '4873');
  addTest('https:[::1]:4873', 'https', '::1', '4873');

  addTest('unix:/tmp/foo.sock', 'http', '/tmp/foo.sock');
  addTest('http:unix:foo.sock', 'http', 'foo.sock');
  addTest('https://unix:foo.sock', 'https', 'foo.sock');

  addTest('blah', null);
  addTest('blah://4873', null);
  addTest('https://blah:4873///', null);
  addTest('unix:1234', 'http', 'unix', '1234'); // not unix socket
});
