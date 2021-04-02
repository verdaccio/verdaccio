const path = require('path');
const fse = require('fs-extra');
const { staticPath, manifest, manifestFiles } = require('@verdaccio/ui-theme')();
fse.copySync(staticPath, path.join(__dirname, '../dist/static'));
// eslint-disable-next-line no-console
console.log('theme files copied');
