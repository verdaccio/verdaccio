import fs from 'fs';
import path from 'path';
import os from 'os';
import { green } from 'kleur';
import { spawn } from 'child_process';
import { npm } from '../utils/process';
import * as __global from '../utils/global.js';

module.exports = async () => {
  const tempRoot = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'verdaccio-cli-e2e-'));
  const tempConfigFile = path.join(tempRoot, 'verdaccio.yaml');
  __global.addItem('dir-root', tempRoot);
  console.log(green(`Global temp root folder: ${tempRoot}`));
  fs.copyFileSync(path.join(__dirname, '../config/_bootstrap_verdaccio.yaml'), tempConfigFile);
  console.log(green(`global temp root conf: ${tempConfigFile}`));
  // @ts-ignore
  global.__namespace = __global;
  console.log(`current directory: ${process.cwd()}`);
  const rootVerdaccio = path.resolve('./bin/verdaccio');
  console.log(green(`verdaccio root path: ${rootVerdaccio}`));
  // @ts-ignore
  global.registryProcess = spawn('node', [path.resolve('./bin/verdaccio'), '-c', './verdaccio.yaml'], {
    cwd: tempRoot,
    // stdio: 'pipe'
  });

  // @ts-ignore
  global.registryProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // @ts-ignore
  global.registryProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  // @ts-ignore
  global.registryProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  // publish current build version on local registry
  await npm('publish', '--registry', 'http://localhost:4873', '--verbose');
};
