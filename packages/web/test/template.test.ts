import template from '../src/template';
const manifest = require('./partials/manifest/manifest.json');

const exampleManifest = {
  css: ['main.css'],
  js: ['runtime.js', 'main.js'],
  ico: '/static/foo.ico',
};

describe('template', () => {
  test('custom render', () => {
    expect(template({ options: {}, manifest: exampleManifest }, manifest)).toMatchSnapshot();
  });

  test('custom title', () => {
    expect(
      template({ options: { title: 'foo title' }, manifest: exampleManifest }, manifest)
    ).toMatchSnapshot();
  });

  test('custom body after', () => {
    expect(
      template({ bodyAfter: [`<script src="foo"/>`], manifest: exampleManifest }, manifest)
    ).toMatchSnapshot();
  });

  test('custom body before', () => {
    expect(
      template(
        {
          bodyBefore: [`<script src="fooBefore"/>`, `<script src="barBefore"/>`],
          manifest: exampleManifest,
        },
        manifest
      )
    ).toMatchSnapshot();
  });
});
