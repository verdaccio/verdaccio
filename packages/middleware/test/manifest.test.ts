import { getManifestValue } from '../src/middlewares/web/utils/manifest';

const manifest = require('./partials/manifest/manifest.json');

describe('manifest', () => {
  test('getManifestValue', () => {
    expect(getManifestValue(['main.js'], manifest)).toEqual([
      '/-/static/main.6126058572f989c948b1.js',
    ]);
  });

  test('getManifestValue with base', () => {
    expect(getManifestValue(['favicon.ico'], manifest, 'http://domain.com')).toEqual([
      'http://domain.com/-/static/favicon.ico',
    ]);
  });

  test('getManifestValue with base with trailing slash', () => {
    expect(getManifestValue(['favicon.ico'], manifest, 'http://domain.com/')).toEqual([
      'http://domain.com/-/static/favicon.ico',
    ]);
  });
});
