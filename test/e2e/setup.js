const { green } = require('kleur');
const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  console.log(green('Setup Puppeteer'));
  const browser = await puppeteer.launch({ headless: true, /* slowMo: 300 */ args: ['--no-sandbox'] });
  global.__BROWSER__ = browser;
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
