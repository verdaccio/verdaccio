import buildDebug from 'debug';

import { logger } from '@verdaccio/logger';
import { HTTP_STATUS } from '@verdaccio/commons-api';

const debug = buildDebug('verdaccio:hooks:request');
const fetch = require('undici-fetch');

export type FetchOptions = {
  body: string;
  headers?: {};
  method?: string;
};

export async function notifyRequest(url: string, options: FetchOptions): Promise<boolean> {
  let response;
  try {
    debug('uri %o', url);
    response = await fetch(url, {
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
