import got from 'got';

import { API_ERROR, HTTP_STATUS, errorUtils } from '@verdaccio/core';

// the same context an attestations request gets: url, headers, agent, retries and breaker hooks
import type { AttestationsRequest as UplinkRequest } from './attestations';

export interface RegistryKey {
  expires: string | null;
  keyid: string;
  keytype: string;
  scheme: string;
  key: string;
}

export const REGISTRY_KEYS_PATH = '/-/npm/v1/keys';

/** True only for an entry with the full shape npm publishes under `/-/npm/v1/keys`. */
export function isRegistryKey(item: any): item is RegistryKey {
  return (
    typeof item?.keyid === 'string' &&
    item.keyid !== '' &&
    typeof item.key === 'string' &&
    typeof item.keytype === 'string' &&
    typeof item.scheme === 'string' &&
    (item.expires === null || typeof item.expires === 'string')
  );
}

/** Signing keys the uplink publishes for `npm audit signatures`; null when it has none (404). */
export async function fetchRegistryKeys({
  uri,
  logger,
  isTimeout,
  ...options
}: UplinkRequest): Promise<RegistryKey[] | null> {
  const request = { method: 'GET', url: uri };
  try {
    const response = await got<{ keys?: RegistryKey[] }>(uri, { ...options, responseType: 'json' });
    logger.http(
      { request, status: response.statusCode },
      "@{!status}, req: '@{request.method} @{request.url}'"
    );
    const keys = response.body?.keys;
    // a 2xx without a keys array, or with a malformed entry, is a broken uplink, not a
    // registry without keys; dropping the entry would let an incomplete set be cached
    if (!Array.isArray(keys) || !keys.every(isRegistryKey)) {
      throw errorUtils.getInternalError(API_ERROR.INVALID_UPLINK_KEYS_RESPONSE);
    }
    return keys;
  } catch (err: any) {
    if (err.code === 'ERR_NON_2XX_3XX_RESPONSE') {
      const code = err.response.statusCode;
      logger.http({ request, status: code }, "@{!status}, req: '@{request.method} @{request.url}'");
      if (code === HTTP_STATUS.NOT_FOUND) {
        return null;
      }
      const error = errorUtils.getInternalError(`${API_ERROR.BAD_STATUS_CODE}: ${code}`);
      error.remoteStatus = code;
      throw error;
    }
    if (isTimeout(err)) {
      throw errorUtils.getServiceUnavailable(API_ERROR.SERVER_TIME_OUT);
    }
    throw err;
  }
}
