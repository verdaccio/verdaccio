import type { IncomingHttpHeaders } from 'node:http';

import type { RequestOptions } from '@verdaccio/url';

import type { $RequestExtend } from '../types';

export function getRequestOptions(req: $RequestExtend): RequestOptions {
  return {
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
}
