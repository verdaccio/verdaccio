const buildDebug = require('debug');
const path = require('path');

const debug = buildDebug('verdaccio:plugin:ui-theme');

const manifest = require('./static/manifest.json');

// Entry-point scripts that must be eagerly loaded in the HTML.
// Lazy-loaded code-split chunks (e.g. Home.js, Version.js) are excluded
// so they remain loaded on demand by the bundler runtime.
const ENTRY_POINTS = ['runtime.js', 'vendors.js', 'main.js'];

function getManifestFiles(manifest) {
  const keys = Object.keys(manifest);
  const js = ENTRY_POINTS.filter((entry) => keys.includes(entry));
  const css = keys.filter((k) => k.endsWith('.css'));
  const ico = keys.find((k) => k.endsWith('.ico')) || 'favicon.ico';
  debug('manifest files js: %o', js);
  debug('manifest files css: %o', css);
  debug('manifest files ico: %o', ico);
  return { js, css, ico };
}

module.exports = () => {
  const staticPath = path.join(__dirname, 'static');
  const manifestFiles = getManifestFiles(manifest);
  debug('static path: %o', staticPath);
  debug('manifest keys: %o', Object.keys(manifest));
  return {
    // location of the static files, build output
    staticPath,
    // asset manifest json file
    manifest,
    // derived from manifest keys — works with any bundler
    manifestFiles,
  };
};
