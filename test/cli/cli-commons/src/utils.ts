import fs from 'fs-extra';
import { cp, readFile, writeFile } from 'fs/promises';
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

export function addYarnClassicPrefix(installFolder) {
  // info regarding cwd flag
  // https://github.com/yarnpkg/yarn/pull/4174
  return ['--cwd', installFolder];
}

export async function prepareYarnModernProject(
  templatePath: string,
  projectName: string,
  registryDomain: string,
  yarnPath: string
) {
  const tempFolder = await createTempFolder(projectName);
  // FUTURE: native copy folder instead fs-extra
  fs.copySync(templatePath, tempFolder);
  const yamlPath = join(tempFolder, '.yarnrc.yml');
  const yamlContent = await readFile(yamlPath, 'utf8');
  const finalYamlContent = yamlContent.replace('${registry}', registryDomain);
  await writeFile(yamlPath, finalYamlContent);
  await cp(yarnPath, join(tempFolder, '.yarn/releases/yarn.js'), { dereference: true });
  return { tempFolder };
}
