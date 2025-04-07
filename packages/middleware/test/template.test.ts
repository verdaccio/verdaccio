import { describe, expect, test } from 'vitest';

import template from '../src/middlewares/web/utils/template';

const manifest = require('./partials/manifest/manifest.json');

// manifest expected to have leading slash
// see packages\middleware\test\partials\manifest\manifest.json
const exampleManifest = {
  css: ['main.css'],
  js: ['runtime.js', 'main.js'],
  ico: 'favicon.ico',
};

// "base" is expected to be result of getPublicUrl
// i.e. it must be valid URL with trailing slash
describe('template', () => {
  test('custom render', () => {
    expect(
      template({ options: { base: 'http://domain.com/' }, manifest: exampleManifest }, manifest)
    ).toMatchSnapshot();
  });

  test('custom title', () => {
    expect(
      template(
        { options: { base: 'http://domain.com/', title: 'foo title' }, manifest: exampleManifest },
        manifest
      )
    ).toMatchSnapshot();
  });

  test('meta scripts', () => {
    expect(
      template(
        {
          options: { base: 'http://domain.com/' },
          metaScripts: [`<style>.someclass{font-size:10px;}</style>`],
          manifest: exampleManifest,
        },
        manifest
      )
    ).toMatchSnapshot();
  });

  test('custom body after', () => {
    expect(
      template(
        {
          options: { base: 'http://domain.com/' },
          scriptsBodyAfter: [`<script src="foo"/>`],
          manifest: exampleManifest,
        },
        manifest
      )
    ).toMatchSnapshot();
  });

  test('custom body before', () => {
    expect(
      template(
        {
          options: { base: 'http://domain.com/' },
          scriptsBodyBefore: [`<script src="fooBefore"/>`, `<script src="barBefore"/>`],
          manifest: exampleManifest,
        },
        manifest
      )
    ).toMatchSnapshot();
  });
});
