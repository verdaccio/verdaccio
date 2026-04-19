import { join } from 'node:path';

import { parseConfigFile } from '../parse';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname;

export function getDefaultConfig(fileName: string = 'default.yaml') {
  const file = join(currentDir, `./${fileName}`);
  return parseConfigFile(file);
}
