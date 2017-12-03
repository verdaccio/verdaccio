// @flow
import type {IVerdaccioConfig} from './types';

export class VerdaccioConfig implements IVerdaccioConfig {

  storagePath: string;
  configPath: string;
  domainPath: string;

  constructor(storagePath: string, configPath: string, domainPath: string) {
    this.storagePath = storagePath;
    this.configPath = configPath;
    this.domainPath = domainPath;
  }
}
