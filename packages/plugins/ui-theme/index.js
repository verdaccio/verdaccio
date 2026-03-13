const buildDebug = require('debug');
const path = require('path');

const debug = buildDebug('verdaccio:plugin:ui-theme');

const manifest = require('./static/manifest.json');

// With type="module", the browser resolves all static and dynamic imports
// automatically from the entry point. Only main.js needs a <script> tag.
const ENTRY_POINTS = ['main.js'];

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
