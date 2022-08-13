import { Config } from '../configuration';
import { IBasicAuth } from './auth';
import { IPlugin } from './commons';

// TODO: convert to generic storage should come from implementation
export interface IPluginMiddleware<T, K> extends IPlugin<T> {
  register_middlewares(app: any, auth: IBasicAuth<T>, storage: K): void;
}
