import { yellow } from 'kleur';
const fs = require('fs');
import os from 'os';
import {ChildProcess, spawn} from 'child_process';
import path from 'path';
import NodeEnvironment from 'jest-environment-node';
const __global = require('../utils/global');
import { npm } from '../utils/process';


class PuppeteerEnvironment extends NodeEnvironment {
  private registryProcess: ChildProcess | null;
  constructor(config) {
    super(config)
    this.registryProcess = null;
  }

  async setup() {
    const tempRoot = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'verdaccio-cli-e2e-'));
    __global.addItem('dir-root', tempRoot);
    console.log(yellow(`Add temp root folder: ${tempRoot}`));
    fs.copyFileSync(
      path.join(__dirname, '../config/_bootstrap_verdaccio.yaml'),
      path.join(tempRoot, 'verdaccio.yaml'),
    );
    this.global.__namespace = __global;
    console.log(`current directory: ${process.cwd()}`);
    console.log('resolve-->', require.resolve('verdaccio/bin/verdaccio'));
    this.registryProcess = spawn(
      'node',
      [require.resolve('verdaccio/bin/verdaccio'), '-c', './verdaccio.yaml'],
      { cwd: tempRoot, stdio: 'inherit' },
    );

    // publish current build version on local registry
    await npm('publish', '--registry' ,'http://localhost:4873');
  }

  async teardown() {
    // @ts-ignore
    this.registryProcess.kill()
  }

  runScript(script) {
    return super.runScript(script);
  }
}

export default PuppeteerEnvironment;
