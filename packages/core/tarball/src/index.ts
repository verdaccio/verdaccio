import type { RequestOptions } from '@verdaccio/url';

export {
  convertDistRemoteToLocalTarballUrls,
  convertDistVersionToLocalTarballsUrl,
} from './convertDistRemoteToLocalTarballUrls';
export { getLocalRegistryTarballUri } from './getLocalRegistryTarballUri';
export { getTarballDetails, type TarballDetails } from './getTarballDetails';
export {
  DEFAULT_MAX_README_SIZE,
  extractTarballMetadata,
  TarballLimitError,
  type ExtractTarballMetadataOptions,
  type TarballMetadata,
} from './extractTarballMetadata';

export type { RequestOptions };
