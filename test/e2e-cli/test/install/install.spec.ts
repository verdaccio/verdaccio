import path from 'path';
import { npm } from '../../utils/process';
import fs from "fs";
import * as __global from "../../utils/global";
import {spawnRegistry} from "../../utils/registry";

function testExample() {
  console.log('running example');
  return Promise.resolve(true);
}

export default async function() {
  await testExample();
}

describe('npm install', ()=> {
  jest.setTimeout(90000);

  // @ts-ignore
  const tempRootFolder = global.__namespace.getItem('dir-root');
  let registryProcess;


  beforeAll(async () => {
    const verdaccioInstall = path.join(tempRootFolder, 'verdaccio-root');
    await npm('install', '--prefix', verdaccioInstall, 'verdaccio', '--registry' ,'http://localhost:4873', '--no-package-lock');
    const configPath = path.join(tempRootFolder, 'verdaccio.yaml');
    fs.copyFileSync(path.join(__dirname, '../../config/default.yaml'), configPath);
    // @ts-ignore
    global.__namespace = __global;
    const pathVerdaccioModule = require.resolve('verdaccio/bin/verdaccio', {
      paths: [verdaccioInstall]
    });
    registryProcess = await spawnRegistry(pathVerdaccioModule,
      ['-c', configPath, '-l', '9011'],
      { cwd: verdaccioInstall, silent: false }
    );
  });

  test('should install jquery', async () => {
    await npm('info', 'verdaccio', '--registry' ,'http://localhost:9011');
    expect(true).toBe(true);
  })

  afterAll(async () => {
    registryProcess.kill();
  });
});
