const fs = require('fs');
import os from 'os';
import path from 'path';
import NodeEnvironment from 'jest-environment-node';
const __global = require('../utils/global');
// import { npm } from '../utils/process';


class E2ECliTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    const tempRoot = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'verdaccio-suite-test-'));
    __global.addItem('dir-root', tempRoot);
    this.global.__namespace = __global;
    console.log(`current directory: ${process.cwd()}`);
  }

  async teardown() {}

  runScript(script) {
    return super.runScript(script);
  }
}

export default E2ECliTestEnvironment;
