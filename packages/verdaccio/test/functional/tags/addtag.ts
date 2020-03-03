import {API_ERROR, HTTP_STATUS, CHARACTER_ENCODING} from "@verdaccio/dev-commons";

import {readFile} from '../lib/test.utils';

const readTags = () => readFile('../fixtures/publish.json5');

export default function(server) {

  describe('should test add tag', () => {

    const PKG_NAME = 'testpkg-tag';
    const PKG_VERSION = '0.0.1';

    test('should fails on add tag to non existing package', () => {
      return server.addTag(PKG_NAME, 'tagtagtag', PKG_VERSION)
        .status(HTTP_STATUS.NOT_FOUND).body_error(API_ERROR.NO_PACKAGE);
    });

    describe('should test add tag to a package', () => {
      beforeAll(function() {
        return server.putPackage(PKG_NAME,
          JSON.parse(readTags().toString(CHARACTER_ENCODING.UTF8).replace(/__NAME__/g, PKG_NAME)
            .replace(/__VERSION__/g, PKG_VERSION))
        ).status(HTTP_STATUS.CREATED);
      });

      describe('should test valid formats tags', () => {
        test('should fails on add a tag that do not exist', () => {
          return server.addTag(PKG_NAME, 'tagtagtag', '4.0.0-no-exist')
            .status(HTTP_STATUS.NOT_FOUND)
            .body_error(API_ERROR.VERSION_NOT_EXIST);
        });

        test('should add tag succesfully minor version', () => {
          return server.addTag(PKG_NAME, 'tagtagtag', PKG_VERSION)
            .status(HTTP_STATUS.CREATED)
            .body_ok(/tagged/);
        });
      });

      describe('should test handle invalid tag and version names', () => {
        const INVALID_TAG ='tag/tag/tag';
        const handleInvalidTag = function(tag, version) {
          return server.addTag(PKG_NAME, tag, version)
            .status(HTTP_STATUS.FORBIDDEN)
            .body_error(/invalid tag/);
        };

        test('should fails on add tag for bad format', () => {
          return handleInvalidTag(INVALID_TAG, '0.0.1-x');
        });

        test('should fails on add tag for bad format negative version', () => {
          return handleInvalidTag(INVALID_TAG, '-0.0.1');
        });

        test('should fails on add tag for bad format empty version', () => {
          return handleInvalidTag(INVALID_TAG, '');
        });

        test('should fails on add tag for bad format symbols', () => {
          return handleInvalidTag(INVALID_TAG, '%^$%&$%^%$$#@');
        });
      });
    });
  });
}
