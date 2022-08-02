import fs from 'fs-extra';
import { join } from 'path';

import { fileUtils } from '@verdaccio/core';

export function createProject(projectName: string) {
  // @ts-ignore
  const tempRootFolder = global.__namespace.getItem('dir-suite-root');
  const verdaccioInstall = join(tempRootFolder, projectName);
  fs.mkdirSync(verdaccioInstall);

  return verdaccioInstall;
}
export function copyConfigFile(rootFolder, configTemplate): string {
  const configPath = join(rootFolder, 'config.yaml');
  copyTo(join(__dirname, configTemplate), configPath);

  return configPath;
}

export async function createTempFolder(prefix: string) {
  return fileUtils.createTempFolder(prefix);
}

export function copyTo(from, to) {
  fs.copyFileSync(from, to);
}

export function cleanUpTemp(tmpFolder) {
  fs.rmdirSync(tmpFolder, { recursive: true });
}

export function addRegistry(registryUrl) {
  return ['--registry', registryUrl];
}

export function addNpmPrefix(installFolder) {
  return ['--prefix', installFolder];
}

export function addYarnPrefix(installFolder) {
  // info regarding cwd flag
  // https://github.com/yarnpkg/yarn/pull/4174
  return ['--cwd', installFolder];
}
