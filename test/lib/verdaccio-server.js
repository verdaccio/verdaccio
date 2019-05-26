// @flow
import {IVerdaccioConfig} from '../types';

export class VerdaccioConfig implements IVerdaccioConfig {

  storagePath: string;
  configPath: string;
  domainPath: string;
  port: number;

  constructor(storagePath: string, configPath: string, domainPath: string, port: number) {
    this.storagePath = storagePath;
    this.configPath = configPath;
    this.domainPath = domainPath;
    this.port = port;
  }
}
