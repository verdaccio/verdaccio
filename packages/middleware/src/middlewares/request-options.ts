import buildDebug from 'debug';
import { IncomingHttpHeaders } from 'node:http';

import type { RequestOptions } from '@verdaccio/url';

import { $RequestExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:request-options');

export function getRequestOptions(req: $RequestExtend): RequestOptions {
  const requestOptions = {
    // FIXME: decide if host should contain port or not
    //
    // Express 4:
    // - req.host is marked as deprecated since it does not include the port
    // - use req.headers['host'] instead, which includes the port
    // Express 5:
    // - req.host is fully supported and includes the port
    // - https://expressjs.com/en/api.html#req.host
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
