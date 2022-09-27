import { cp, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { Dependencies } from '@verdaccio/types';

import { createTempFolder, getPackageJSON, getREADME } from './utils';

export async function prepareYarnModernProject(
  projectName: string,
  registryDomain: string,
  yarnBinPath: string,
  pkgJson: {
    packageName: string;
    version: string;
    dependencies: Dependencies;
    devDependencies: Dependencies;
  }
) {
  const tempFolder = await createTempFolder(projectName);
  const yamlPath = join(__dirname, '../partials', '.yarnrc.yml');
  const yamlContent = await readFile(yamlPath, 'utf8');
  const finalYamlContent = yamlContent.replace('${registry}', registryDomain);
  await writeFile(join(tempFolder, '.yarnrc.yml'), finalYamlContent);
  const { packageName, version, dependencies, devDependencies } = pkgJson;
  await writeFile(
    join(tempFolder, 'package.json'),
    getPackageJSON(packageName, version, dependencies, devDependencies)
  );
  await writeFile(join(tempFolder, 'README.md'), getREADME(packageName));
  await cp(yarnBinPath, join(tempFolder, '.yarn/releases/yarn.js'), { dereference: true });
  return { tempFolder };
}
