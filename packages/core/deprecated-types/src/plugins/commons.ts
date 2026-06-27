import type { Config, Logger } from '../configuration';

export class Plugin<T> {
  public constructor(_config: T, _options: PluginOptions<T>) {}
}

export interface IPlugin<_T> {
  // TODO: not used on core yet
  version?: string;
}

export interface PluginOptions<T> {
  config: T & Config;
  logger: Logger;
}
