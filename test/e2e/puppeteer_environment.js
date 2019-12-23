/* eslint new-cap: 0 */

const { yellow } = require('kleur');
const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {VerdaccioConfig} = require("../lib/verdaccio-server");
const VerdaccioProcess = require("../lib/server_process");
const Server = require("../lib/server");


const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    const config1 = new VerdaccioConfig(path.join(__dirname, './store-e2e'),
      path.join(__dirname, './config/config-scoped-e2e.yaml'), 'http://0.0.0.0:55558/', 55558);
    const config2 = new VerdaccioConfig(path.join(__dirname, './store-e2e'),
      path.join(__dirname, './config/config-protected-e2e.yaml'), 'http://0.0.0.0:55552/', 55552);
    const server1 = new Server.default(config1.domainPath);
    const server2 = new Server.default(config2.domainPath);
    const process1 = new VerdaccioProcess.default(config1, server1, false);
    const process2 = new VerdaccioProcess.default(config2, server2, false);
    const fork = await process1.init();
    const fork2 = await process2.init();
    this.global.__VERDACCIO_E2E__ = fork[0];
    this.global.__VERDACCIO__PROTECTED_E2E__ = fork2[0];

    console.log(yellow('Setup Test Environment.'));
    await super.setup();
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }
    this.global.__SERVER__ = server1;
    this.global.__SERVER_PROTECTED__ = server2;
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    })
  }

  async teardown() {
    console.log(yellow('Teardown Test Environment.'));
    await super.teardown();
    this.global.__VERDACCIO_E2E__.stop();
    this.global.__VERDACCIO__PROTECTED_E2E__.stop();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
