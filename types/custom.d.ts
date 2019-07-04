import { Logger, RemoteUser } from "@verdaccio/types";

declare global {
  namespace Express {
    export interface Request {
      remote_user: RemoteUser;
      log: Logger;
    }

    export interface Response {
      report_error: any;
    }
  }
}
