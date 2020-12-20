import os from 'os';
import path from 'path';
import buildDebug from 'debug';
import NodeEnvironment from 'jest-environment-node';
const fs = require('fs');

const __global = require('../utils/global');

const debug = buildDebug('verdaccio:e2e:env');

class E2ECliTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    // create an unique suite location peer test to avoid conflicts
    const tempRoot = fs.mkdtempSync(
      path.join(fs.realpathSync(os.tmpdir()), 'verdaccio-suite-test-')
    );
    debug('suite temporary folder %o', tempRoot);
    __global.addItem('dir-suite-root', tempRoot);
    // @ts-ignore
    this.global.__namespace = __global;
    debug(`current directory: ${process.cwd()}`);
  }

  async teardown() {
    // TODO: clean folder
  }

  runScript(script): any {
    return super.runScript(script);
  }
}

export default E2ECliTestEnvironment;
