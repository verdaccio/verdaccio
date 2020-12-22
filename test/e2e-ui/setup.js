const fs = require('fs');
const os = require('os');
const path = require('path');

const { green } = require('kleur');
const mkdirp = require('mkdirp');
const puppeteer = require('puppeteer');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  console.log(green('Setup Puppeteer'));
  const browser = await puppeteer.launch({
    headless: true,
    // slowMo: 600,
    // devtools: true,
    args: ['--no-sandbox'],
  });
  global.__BROWSER__ = browser;
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
