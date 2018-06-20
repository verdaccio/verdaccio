import {readFile} from '../lib/test.utils';
import {HTTP_STATUS} from "../../../src/lib/constants";

const readTags = () => readFile('../fixtures/publish.json5');

export default function(server) {
  test('add tag - 404', () => {
    return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1')
      .status(HTTP_STATUS.NOT_FOUND)
      .body_error(/no such package/);
  });

  describe('addtag', () => {
    beforeAll(function() {
      return server.putPackage('testpkg-tag', eval(
        '(' + readTags()
          .toString('utf8')
          .replace(/__NAME__/g, 'testpkg-tag')
          .replace(/__VERSION__/g, '0.0.1')
        + ')'
      )).status(HTTP_STATUS.CREATED);
    });

    test('add testpkg-tag', () => {});

    test('should fails on add non semver version tag ', () => {
      return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1-x')
        .status(HTTP_STATUS.NOT_FOUND)
        .body_error(/version doesn't exist/);
    });

    test('add tag - bad tag', () => {
      return server.addTag('testpkg-tag', 'tag/tag/tag', '0.0.1-x')
        .status(HTTP_STATUS.FORBIDDEN)
        .body_error(/invalid tag/);
    });

    test('add tag - good', () => {
      return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1')
        .status(HTTP_STATUS.CREATED)
        .body_ok(/tagged/);
    });
  });
}
