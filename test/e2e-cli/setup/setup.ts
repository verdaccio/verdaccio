import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { yellow } from 'kleur';
import { npm } from '../utils/process';
import * as __global from '../utils/global.js';

module.exports = async () => {
  const tempRoot = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'verdaccio-cli-e2e-'));
  __global.addItem('dir-root', tempRoot);
  console.log(yellow(`Add temp root folder: ${tempRoot}`));
  fs.copyFileSync(path.join(__dirname, '../config/_bootstrap_verdaccio.yaml'), path.join(tempRoot, 'verdaccio.yaml'));
  // @ts-ignore
  global.__namespace = __global;
  console.log(`current directory: ${process.cwd()}`);
  // @ts-ignore
  global.registryProcess = spawn(
    'node',
    [require.resolve('verdaccio/bin/verdaccio'), '-c', './verdaccio.yaml'],
    // @ts-ignore
    { cwd: tempRoot, silence: true }
  );

  // publish current build version on local registry
  await npm('publish', '--registry', 'http://localhost:4873');
};
