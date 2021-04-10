const fs = require('fs');
const os = require('os');
const path = require('path');

const { green } = require('kleur');
const mkdirp = require('mkdirp');
const puppeteer = require('puppeteer');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  console.log(green('Setup Puppeteer'));
  const browser = await puppeteer.launch({
    isMobile: false,
    ignoreHTTPSErrors: true,
    // invert values for local testing
    devtools: false,
    headless: true,
    // slowMo: 6000,
    // invert values for local testing
    args: ['--no-sandbox'],
  });
  global.__BROWSER__ = browser;
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
