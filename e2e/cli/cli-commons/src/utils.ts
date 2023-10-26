import fs from 'fs-extra';
import { cp, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { fileUtils } from '@verdaccio/core';

export function createProject(projectName: string) {
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

export const getPackageJSON = (
  packageName,
  version = '1.0.0',
  dependencies = {},
  devDependencies = {}
) => {
  const json = {
    name: packageName,
    version,
    description: 'some cool project',
    main: 'index.js',
    scripts: {
      test: 'echo exit 1',
    },
    dependencies,
    devDependencies,
    keywords: ['foo', 'bar'],
    author: 'Yoooooo <jota@some.org>',
    license: 'MIT',
  };
  return JSON.stringify(json);
};

export const getREADME = (packageName) => `
   # My README ${packageName}

   some text

   ## subtitle

   more text
  `;

export async function prepareGenericEmptyProject(
  packageName: string,
  version: string,
  port: number,
  token: string,
  registryDomain: string,
  dependencies: any = {},
  devDependencies: any = {}
) {
  const getNPMrc = (port, token, registry) => `//localhost:${port}/:_authToken=${token}
  registry=${registry}`;
  const tempFolder = await createTempFolder('temp-folder');
  await writeFile(
    join(tempFolder, 'package.json'),
    getPackageJSON(packageName, version, dependencies, devDependencies)
  );
  await writeFile(join(tempFolder, 'README.md'), getREADME(packageName));
  await writeFile(join(tempFolder, '.npmrc'), getNPMrc(port, token, registryDomain));
  return { tempFolder };
}

export function nJSONParse(jsonString) {
  const type = typeof jsonString;
  if (type !== 'string') throw new Error(`Input have to be string but got ${type}`);

  const jsonRows = jsonString.split(/\n|\n\r/).filter(Boolean);
  console.log('--jsonRows', jsonRows);
  return jsonRows.map((jsonStringRow) => JSON.parse(jsonStringRow));
}
