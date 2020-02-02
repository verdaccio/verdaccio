import {IVerdaccioConfig} from './types';

export class VerdaccioConfig implements IVerdaccioConfig {

  public storagePath: string;
  public configPath: string;
  public domainPath: string;
  public port: number;

  public constructor(storagePath: string, configPath: string, domainPath: string, port: number) {
    this.storagePath = storagePath;
    this.configPath = configPath;
    this.domainPath = domainPath;
    this.port = port;
  }
}
