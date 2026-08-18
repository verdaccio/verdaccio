import { join } from 'node:path';

import { parseConfigFile } from '../parse';

export function getDefaultConfig(fileName: string = 'default.yaml') {
  const currentDir = import.meta.dirname ?? __dirname;
  const file = join(currentDir, `./${fileName}`);
  return parseConfigFile(file);
}
