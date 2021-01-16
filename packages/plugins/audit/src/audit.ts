import util from 'util';
import https from 'https';

import fetch from 'node-fetch';
import createHttpsProxyAgent from 'https-proxy-agent';
import express, { Request, Response } from 'express';
import { Logger, IPluginMiddleware, IBasicAuth, PluginOptions } from '@verdaccio/types';

import { ConfigAudit } from './types';

const streamPipeline = util.promisify(require('stream').pipeline);

// FUTURE: we should be able to overwrite this
export const REGISTRY_DOMAIN = 'https://registry.npmjs.org';
export const AUDIT_ENDPOINT = `/-/npm/v1/security/audits`;

function getSSLAgent(rejectUnauthorized) {
  return new https.Agent({ rejectUnauthorized });
}

export default class ProxyAudit implements IPluginMiddleware<{}> {
  public enabled: boolean;
  public logger: Logger;
  public strict_ssl: boolean;

  public constructor(config: ConfigAudit, options: PluginOptions<{}>) {
    this.enabled = config.enabled || false;
    this.strict_ssl = config.strict_ssl !== undefined ? config.strict_ssl : true;
    this.logger = options.logger;
  }

  public register_middlewares(app: any, auth: IBasicAuth<ConfigAudit>): void {
    const fetchAudit = (req: Request, res: Response & { report_error?: Function }): void => {
      const headers = req.headers;
      headers.host = 'https://registry.npmjs.org/';

      let requestOptions: any = {
        method: req.method,
        headers,
      };

      if (this.strict_ssl) {
        requestOptions = Object.assign({}, requestOptions, {
          agent: getSSLAgent(this.strict_ssl),
        });
      }

      if (auth?.config?.https_proxy) {
        // we should check whether this works fine after this migration
        // please notify if anyone is having issues
        const agent = createHttpsProxyAgent(auth?.config?.https_proxy);
        requestOptions = Object.assign({}, requestOptions, {
          agent,
        });
      }

      (async () => {
        try {
          const response = await fetch(`${REGISTRY_DOMAIN}${AUDIT_ENDPOINT}`, requestOptions);
          if (response.ok) {
            return streamPipeline(response.body, res);
          }

          res.status(response.status).end();
        } catch {
          res.status(500).end();
        }
      })();
    };

    const handleAudit = (req: Request, res: Response): void => {
      if (this.enabled) {
        fetchAudit(req, res);
      } else {
        res.status(500).end();
      }
    };

    /* eslint new-cap:off */
    const router = express.Router();
    /* eslint new-cap:off */
    router.post('/audits', handleAudit);

    router.post('/audits/quick', handleAudit);

    app.use('/-/npm/v1/security', router);
  }
}
