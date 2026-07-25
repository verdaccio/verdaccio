import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseConfigFile } from '../parse';

// import.meta.url is only defined in the ESM build; the CJS build falls back to __dirname
const currentDir = import.meta.url ? dirname(fileURLToPath(import.meta.url)) : __dirname;

export function getDefaultConfig(fileName: string = 'default.yaml') {
  const file = join(currentDir, `./${fileName}`);
  return parseConfigFile(file);
}
