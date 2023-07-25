import buildDebug from 'debug';
import got from 'got-cjs';

import { HTTP_STATUS } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';

const debug = buildDebug('verdaccio:hooks:request');

export type FetchOptions = {
  body: string;
  headers?: {};
  method?: string;
};

export async function notifyRequest(url: string, options: FetchOptions): Promise<boolean> {
  let response;
  try {
    debug('uri %o', url);
    response = got.post(url, {
      body: JSON.stringify(options.body),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    debug('response.status  %o', response.status);
    const body = await response.json();
    if (response.status >= HTTP_STATUS.BAD_REQUEST) {
      throw new Error(body);
    }

    logger.info(
      { content: options.body },
      'The notification @{content} has been successfully dispatched'
    );
    return true;
  } catch (err: any) {
    debug('request error %o', err);
    logger.error(
      { errorMessage: err?.message },
      'notify service has thrown an error: @{errorMessage}'
    );
    return false;
  }
}
