import type { Package } from '../manifest';
import type { IPlugin } from './commons';

export interface IPluginStorageFilter<T> extends IPlugin<T> {
  filter_metadata(packageInfo: Package): Promise<Package>;
}
