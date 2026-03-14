import type { RequestOptions } from '@verdaccio/url';

export {
  convertDistRemoteToLocalTarballUrls,
  convertDistVersionToLocalTarballsUrl,
} from './convertDistRemoteToLocalTarballUrls';
export { getLocalRegistryTarballUri } from './getLocalRegistryTarballUri';
export { getTarballDetails, type TarballDetails } from './getTarballDetails';

export type { RequestOptions };
