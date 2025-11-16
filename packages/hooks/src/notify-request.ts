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
  const valid: Method[] = ['GET', 'POST', 'PUT'];

  if (typeof value === 'string') {
    const upper = value.toUpperCase() as Method;

    if (valid.includes(upper)) {
      return upper;
    } else {
      logger.warn(
        { method: value },
        'The notification method @{method} is not valid, using default POST method'
      );
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

    const requestOptions: any = {
      method,
      headers: options.headers ?? { 'Content-Type': 'application/json' },
    };

    let finalUrl = url;
    if (method === 'GET' && options.body && typeof options.body === 'object') {
      const urlObj = new URL(url);
      urlObj.search = new URLSearchParams(options.body).toString();
      finalUrl = urlObj.toString();
      debug('final url with search params %o', finalUrl);
    } else if (options.body !== undefined && method !== 'GET') {
      requestOptions.body = JSON.stringify(options.body);
    }

    response = await got(finalUrl, {
      ...requestOptions,
      responseType: 'json',
    });

    const body = await response.body;
    debug('response.status %o', body.statusCode);

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
