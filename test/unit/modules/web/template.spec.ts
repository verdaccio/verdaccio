import renderTemplate from "../../../../src/api/web/html/template";

const manifest = require('./partials/manifest/manifest.json');

const exampleManifest = {
  css: ['main.css'],
  js: ['runtime.js', 'main.js'],
  ico: '/static/foo.ico',
};

describe('template', () => {
  test('custom render', () => {
    expect(renderTemplate({ options: {base: 'http://domain.com'}, manifest: exampleManifest }, manifest)).toMatchSnapshot();
  });

  test('custom title', () => {
    expect(
      renderTemplate({ options: {base: 'http://domain.com', title: 'foo title' }, manifest: exampleManifest }, manifest)
    ).toMatchSnapshot();
  });

  test('custom title', () => {
    expect(
      renderTemplate({ options: {base: 'http://domain.com', title: 'foo title' }, manifest: exampleManifest }, manifest)
    ).toMatchSnapshot();
  });

  test('meta scripts', () => {
    expect(
      renderTemplate({ options: {base: 'http://domain.com'}, metaScripts: [`<style>.someclass{font-size:10px;}</style>`], manifest: exampleManifest }, manifest)
    ).toMatchSnapshot();
  });

  test('custom body after', () => {
    expect(
      renderTemplate({ options: {base: 'http://domain.com'}, scriptsBodyAfter: [`<script src="foo"/>`], manifest: exampleManifest }, manifest)
    ).toMatchSnapshot();
  });

  test('custom body before', () => {
    expect(
      renderTemplate(
        {
          options: {base: 'http://domain.com'},
          scriptsbodyBefore: [`<script src="fooBefore"/>`, `<script src="barBefore"/>`],
          manifest: exampleManifest,
        },
        manifest
      )
    ).toMatchSnapshot();
  });
});
