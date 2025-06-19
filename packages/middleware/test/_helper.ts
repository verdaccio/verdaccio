import path from 'node:path';

import { parseConfigFile } from '@verdaccio/config';

export const getConf = (configName: string) => {
  const configPath = path.join(__dirname, 'config', configName);
  return parseConfigFile(configPath);
};
