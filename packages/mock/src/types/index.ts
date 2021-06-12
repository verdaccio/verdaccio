export interface IVerdaccioConfig {
  storagePath: string;
  configPath: string;
  domainPath: string;
  port: number | string;
}

export interface IServerProcess {
  init(binPath: string): Promise<any>;
  stop(): void;
}
