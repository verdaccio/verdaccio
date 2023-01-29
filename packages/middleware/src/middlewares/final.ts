import _ from 'lodash';

import { HEADERS, HTTP_STATUS, TOKEN_BASIC, TOKEN_BEARER } from '@verdaccio/core';
import { Manifest } from '@verdaccio/types';
import { stringToMD5 } from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend, MiddlewareError } from '../types';

export type FinalBody = Manifest | MiddlewareError | string;

export function final(
  body: FinalBody,
  req: $RequestExtend,
  res: $ResponseExtend,
  // if we remove `next` breaks test
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: $NextFunctionVer
): void {
  if (res.statusCode === HTTP_STATUS.UNAUTHORIZED && !res.getHeader(HEADERS.WWW_AUTH)) {
    res.header(HEADERS.WWW_AUTH, `${TOKEN_BASIC}, ${TOKEN_BEARER}`);
  }

  try {
    if (_.isString(body) || _.isObject(body)) {
      if (!res.get(HEADERS.CONTENT_TYPE)) {
        res.header(HEADERS.CONTENT_TYPE, HEADERS.JSON);
      }

      if (typeof body === 'object' && _.isNil(body) === false) {
        if (typeof (body as MiddlewareError).error === 'string') {
          res.locals._verdaccio_error = (body as MiddlewareError).error;
        }
        body = JSON.stringify(body, undefined, '  ') + '\n';
      }

      // don't send etags with errors
      if (
        !res.statusCode ||
        (res.statusCode >= HTTP_STATUS.OK && res.statusCode < HTTP_STATUS.MULTIPLE_CHOICES)
      ) {
        res.header(HEADERS.ETAG, '"' + stringToMD5(body as string) + '"');
      }
    } else {
      // send(null), send(204), etc.
    }
  } catch (err: any) {
    // if verdaccio sends headers first, and then calls res.send()
    // as an error handler, we can't report error properly,
    // and should just close socket
    if (err.message.match(/set headers after they are sent/)) {
      if (_.isNil(res.socket) === false) {
        res.socket?.destroy();
      }
      return;
    }
    throw err;
  }

  res.send(body);
}
