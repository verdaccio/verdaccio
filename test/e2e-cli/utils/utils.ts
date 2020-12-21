import path from 'path';
import fs from 'fs';

export function createProject(projectName: string) {
  // @ts-ignore
  const tempRootFolder = global.__namespace.getItem('dir-suite-root');
  const verdaccioInstall = path.join(tempRootFolder, projectName);
  fs.mkdirSync(verdaccioInstall);

  return verdaccioInstall;
}
export function copyConfigFile(rootFolder, configTemplate): string {
  const configPath = path.join(rootFolder, 'verdaccio.yaml');
  fs.copyFileSync(path.join(__dirname, configTemplate), configPath);

  return configPath;
}
