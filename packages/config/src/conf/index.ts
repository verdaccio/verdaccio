import { join } from 'path';

import { parseConfigFile } from '../parse';

export function getDefaultConfig(fileName = 'default.yaml') {
  const file = join(__dirname, `./${fileName}`);
  return parseConfigFile(file);
}
