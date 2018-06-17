import {readFile} from '../lib/test.utils';

const readTags = () => readFile('../fixtures/publish.json5');

export default function(server) {
  test('add tag - 404', () => {
    return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1').status(404).body_error(/no such package/);
  });

  describe('addtag', () => {
    beforeAll(function() {
      return server.putPackage('testpkg-tag', eval(
        '(' + readTags()
          .toString('utf8')
          .replace(/__NAME__/g, 'testpkg-tag')
          .replace(/__VERSION__/g, '0.0.1')
        + ')'
      )).status(201);
    });

    test('add testpkg-tag', () => {
      // TODO: ?
    });

    test('add tag - bad ver', () => {
      return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1-x')
        .status(404)
        .body_error(/version doesn't exist/);
    });

    test('add tag - bad tag', () => {
      return server.addTag('testpkg-tag', 'tag/tag/tag', '0.0.1-x')
        .status(403)
        .body_error(/invalid tag/);
    });

    test('add tag - good', () => {
      return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1')
        .status(201)
        .body_ok(/tagged/);
    });
  });
}
