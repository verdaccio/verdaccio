// <reference types="node" />
import * as http from 'http';

import { Logger, RemoteUser } from '@verdaccio/types';

declare global {
  namespace Express {
    export interface Request {
      remote_user: RemoteUser;
      log: Logger;
    }

    // FIXME:
    // export interface Response extends http.ServerResponse, Express.Response {
    //   report_error: any;
    //   _verdaccio_error: any;
    //   socket?: any;
    // }
  }
}
