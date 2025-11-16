import buildDebug from 'debug';
import got, { Method } from 'got-cjs';

import { HTTP_STATUS } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';

const debug = buildDebug('verdaccio:hooks:request');

export type FetchOptions = {
  body: string;
  headers?: {};
  method?: string;
};

export function verifyMethod(value: any): Method {
  const valid: Method[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  if (typeof value === 'string') {
    const upper = value.toUpperCase() as Method;

    if (valid.includes(upper)) {
      return upper;
    }
  }

  return 'POST';
}

export async function notifyRequest(url: string, options: FetchOptions): Promise<boolean> {
  let response;
  try {
    const method: Method = verifyMethod(options.method);
    debug('uri %o', url);
    debug('headers %o', options.headers);
    debug('method %o', method);
    response = got.post(url, {
      body: JSON.stringify(options.body),
      method,
      headers: options.headers ?? { 'Content-Type': 'application/json' },
    });
    const body = await response.json();
    debug('response.status %o', body.statusCode);

    // in case service do not throw error
    if (body.statusCode >= HTTP_STATUS.BAD_REQUEST) {
      throw new Error(body);
    }

    logger.info(
      { content: options.body },
      'The notification @{content} has been successfully dispatched'
    );
    return true;
  } catch (err: any) {
    debug('request error %o:', err?.message);
    logger.error(
      { errorMessage: err?.message },
      'notify service has thrown an error: @{errorMessage}'
    );
    return false;
  }
}
