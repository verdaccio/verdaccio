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

const baseHeaders = { 'Content-Type': 'application/json' };
export async function notifyRequest(url: string, options: FetchOptions): Promise<boolean> {
  let response;
  try {
    const method: Method = verifyMethod(options.method);
    debug('uri %o', url);
    debug('headers %o', options.headers);
    debug('method %o', method);

    let userHeaders: Record<string, any> = {};

    if (options.headers) {
      if (typeof options.headers === 'string') {
        userHeaders = JSON.parse(options.headers);
      } else if (typeof options.headers === 'object') {
        userHeaders = options.headers;
      }
    }

    const headers = { ...baseHeaders, ...userHeaders };
    const requestOptions: any = {
      method,
      headers,
    };

    let finalUrl = url;
    if (method === 'GET') {
      debug('using GET with query params');
      const urlObj = new URL(url);
      const params = new URLSearchParams(options.body);
      params.set('body', options.body);
      urlObj.search = params.toString();
      finalUrl = urlObj.toString();
      debug('final url with search params %o', finalUrl);
    } else if (options.body !== undefined) {
      requestOptions.body = options.body;
    } else {
      throw new Error('Notification body is undefined');
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
