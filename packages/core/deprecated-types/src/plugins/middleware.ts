import { Config } from '../configuration';
import type { IBasicAuth } from './auth';
import type { IPlugin } from './commons';
import type { IStorageManager } from './storage';

export interface IPluginMiddleware<T> extends IPlugin<T> {
  register_middlewares(app: any, auth: IBasicAuth<T>, storage: IStorageManager<T>): void;
}
