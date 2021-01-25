const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const uiTheme = require('@verdaccio/ui-theme');
fse.copySync(uiTheme.staticPath, path.join(__dirname, '../dist/static'));
// eslint-disable-next-line no-console
console.log('theme files copied');
