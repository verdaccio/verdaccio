import type { Agents, Delays, Hooks, RequestError, RetryOptions, Headers as gotHeaders } from 'got';
import got from 'got';

import { API_ERROR, HTTP_STATUS, errorUtils } from '@verdaccio/core';
import type { Logger } from '@verdaccio/types';

export interface AttestationsResponse {
  attestations: { predicateType: string; bundle: unknown }[];
}

/** What the uplink lends to the request: its url, headers, agent, retries and circuit-breaker hooks. */
export interface AttestationsRequest {
  uri: string;
  headers: gotHeaders;
  agent?: Agents;
  timeout?: Delays;
  retry: Partial<RetryOptions>;
  hooks: Partial<Hooks>;
  logger: Logger;
  isTimeout: (err: RequestError) => boolean;
}

// bundles weigh a few KB; anything bigger is not worth buffering
const MAX_RESPONSE_BYTES = 1024 * 1024;

export function attestationsPath(name: string, version: string): string {
  const scoped = encodeURIComponent(name).replace(/^%40/, '@');
  return `/-/npm/v1/attestations/${scoped}@${encodeURIComponent(version)}`;
}

/** Sigstore attestations of a version; null when the uplink has none (a 404 is a regular answer). */
export async function fetchAttestations({
  uri,
  logger,
  isTimeout,
  ...options
}: AttestationsRequest): Promise<AttestationsResponse | null> {
  const request = { method: 'GET', url: uri };
  try {
    const controller = new AbortController();
    const pending = got<AttestationsResponse>(uri, {
      ...options,
      responseType: 'json',
      signal: controller.signal,
    });
    pending.on('downloadProgress', ({ transferred }) => {
      if (transferred > MAX_RESPONSE_BYTES) {
        controller.abort();
      }
    });
    const response = await pending;
    logger.http(
      { request, status: response.statusCode },
      "@{!status}, req: '@{request.method} @{request.url}'"
    );
    return Array.isArray(response.body?.attestations) ? response.body : null;
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
    if (err.name === 'AbortError') {
      logger.warn({ request }, "uplink response too large, req: '@{request.url}'");
      throw errorUtils.getInternalError('uplink response too large');
    }
    throw err;
  }
}
