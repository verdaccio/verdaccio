import buildDebug from 'debug';
import { IncomingHttpHeaders } from 'node:http';

import type { RequestOptions } from '@verdaccio/url';

import { $RequestExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:request-options');

export function getRequestOptions(req: $RequestExtend): RequestOptions {
  const requestOptions = {
    // Verdaccio needs host to include the port for it to work correctly
    //
    // req.hostname strips the port so we use req.host instead
    // (req.host is marked as deprecated in Express 4 but fully supported in Express 5)
    // https://expressjs.com/en/api.html#req.host
    host: req.host,
    protocol: req.protocol,
    headers: req.headers as IncomingHttpHeaders,
    remoteAddress: req.socket.remoteAddress,
    byPassCache: req.query.write === 'true',
    username: req.remote_user?.name ?? undefined,
  };

  debug('request options: %o', requestOptions);

  return requestOptions;
}
