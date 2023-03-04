import { getManifestValue } from '../src/middlewares/web/utils/manifest';

const manifest = require('./partials/manifest/manifest.json');

describe('manifest', () => {
  test('getManifestValue', () => {
    expect(getManifestValue(['main.js'], manifest)).toEqual([
      '/-/static/main.6126058572f989c948b1.js',
    ]);
  });
});
