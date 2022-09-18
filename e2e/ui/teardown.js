const os = require('os');
const path = require('path');

const { green } = require('kleur');
const rimraf = require('rimraf');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  // eslint-disable-next-line no-console
  console.log(green('Teardown Puppeteer'));
  await global.__BROWSER__.close();
  rimraf.sync(DIR);
};
