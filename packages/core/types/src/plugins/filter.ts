import { Manifest } from '../manifest';
import { IPlugin } from './commons';

export interface IPluginStorageFilter<T> extends IPlugin<T> {
  filterMetadata(packageInfo: Manifest): Promise<Manifest>;
}
