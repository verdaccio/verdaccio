import fs from 'fs';
import path from 'path';

export function copyConfigFile(rootFolder, configTemplate): string {
  const configPath = path.join(rootFolder, 'verdaccio.yaml');
  fs.copyFileSync(path.join(__dirname, configTemplate), configPath);

  return configPath;
}
