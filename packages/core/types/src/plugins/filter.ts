import { Manifest } from '../manifest';
import { IPlugin } from './commons';

export interface IPluginStorageFilter<T> extends IPlugin<T> {
  filter_metadata(packageInfo: Manifest): Promise<Manifest>;
}
