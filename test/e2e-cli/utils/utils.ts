import fs from 'fs-extra';
import os from 'os';
import path from 'path';

export function createProject(projectName: string) {
  // @ts-ignore
  const tempRootFolder = global.__namespace.getItem('dir-suite-root');
  const verdaccioInstall = path.join(tempRootFolder, projectName);
  fs.mkdirSync(verdaccioInstall);

  return verdaccioInstall;
}
export function copyConfigFile(rootFolder, configTemplate): string {
  const configPath = path.join(rootFolder, 'verdaccio.yaml');
  copyTo(path.join(__dirname, configTemplate), configPath);

  return configPath;
}

/**
 * @deprecated  use @verdaccio/core:createTempFolder async function instead
 */
export function createTempFolder(prefix: string) {
  return fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), prefix));
}

export function copyTo(from, to) {
  fs.copyFileSync(from, to);
}

export function cleanUpTemp(tmpFolder) {
  fs.rmdirSync(tmpFolder, { recursive: true });
}

export const SETUP_VERDACCIO_PORT = `6001`;
