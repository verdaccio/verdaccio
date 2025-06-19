import YAML from 'js-yaml';
import { cp, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { URL } from 'node:url';

import { Dependencies } from '@verdaccio/types';

import { createTempFolder, getPackageJSON, getREADME } from './utils';

export function createYamlConfig(registry: string, token?: string) {
  const defaultYaml: any = {
    npmRegistryServer: registry,
    yarnPath: '.yarn/releases/yarn.js',
    enableImmutableInstalls: false,
    unsafeHttpWhitelist: ['localhost'],
  };

  if (typeof token === 'string') {
    const url = new URL(registry);
    defaultYaml.npmRegistries = {
      [`//${url.hostname}:${url.port}`]: {
        npmAlwaysAuth: true,
        npmAuthToken: token,
      },
    };
  }

  return YAML.dump(defaultYaml);
}

export async function prepareYarnModernProject(
  projectName: string,
  registryDomain: string,
  yarnBinPath: string,
  pkgJson: {
    packageName: string;
    version: string;
    dependencies: Dependencies;
    devDependencies: Dependencies;
  },
  token?: string
) {
  const tempFolder = await createTempFolder(projectName);
  const yamlContent = createYamlConfig(registryDomain, token);
  await writeFile(join(tempFolder, '.yarnrc.yml'), yamlContent);
  const { packageName, version, dependencies, devDependencies } = pkgJson;
  await writeFile(
    join(tempFolder, 'package.json'),
    getPackageJSON(packageName, version, dependencies, devDependencies)
  );
  await writeFile(join(tempFolder, 'README.md'), getREADME(packageName));
  await cp(yarnBinPath, join(tempFolder, '.yarn/releases/yarn.js'), { dereference: true });
  return { tempFolder };
}
