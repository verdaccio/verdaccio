const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const {VerdaccioConfig} = require("../src/verdaccio-server");
const VerdaccioProcess = require("../src/server_process");
const Server = require("../src/server");

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  const config1 = new VerdaccioConfig(
    path.join(__dirname, './store-e2e'),
    path.join(__dirname, './config-e2e.yaml'),
    'http://localhost:55558/', 55558);
  const server1 = new Server.default(config1.domainPath);
  const process1 = new VerdaccioProcess.default(config1, server1, false);

  const fork = await process1.init();
  console.log(chalk.green('Setup Puppeteer'));
  const browser = await puppeteer.launch({});
  global.__BROWSER__ = browser;
  global.__VERDACCIO_E2E__ = fork[0];
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
