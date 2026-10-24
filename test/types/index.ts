export interface IVerdaccioConfig {
  storagePath: string;
  configPath: string;
  domainPath: string;
  port: number | string;
}

export interface IServerProcess {
  init(): Promise<any>;
  stop(): void;
}

export interface IServerBridge {
  url: string;
  debug(): Promise<any>;
  auth(name: string, password: string): Promise<any>;
}
