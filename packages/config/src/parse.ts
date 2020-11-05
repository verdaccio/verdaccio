import fs from 'fs';
import YAML from 'js-yaml';
import { APP_ERROR, CHARACTER_ENCODING } from '@verdaccio/dev-commons';

export function parseConfigFile(configPath: string): any {
  try {
    if (/\.ya?ml$/i.test(configPath)) {
      // @ts-ignore
      return YAML.safeLoad(fs.readFileSync(configPath, CHARACTER_ENCODING.UTF8));
    }
    return require(configPath);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = APP_ERROR.CONFIG_NOT_VALID;
    }

    throw new Error(e);
  }
}
