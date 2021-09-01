import https from 'https';

import fetch from 'node-fetch';
import createHttpsProxyAgent from 'https-proxy-agent';
import express, { Request, Response } from 'express';
import { Logger, IPluginMiddleware, IBasicAuth, PluginOptions } from '@verdaccio/types';

import { json as jsonParser } from 'body-parser';
import { ConfigAudit } from './types';

// FUTURE: we should be able to overwrite this
export const REGISTRY_DOMAIN = 'https://registry.npmjs.org';

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

      headers['host'] = 'registry.npmjs.org';
      headers['content-encoding'] = 'gzip,deflate,br';

      let requestOptions: any = {
        agent: new https.Agent({ rejectUnauthorized: this.strict_ssl }),
        body: JSON.stringify(req.body),
        headers,
        method: req.method,
      };

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
          const auditEndpoint = `${REGISTRY_DOMAIN}${req.baseUrl}${req.route.path}`;
          this.logger.debug('fetching audit from ' + auditEndpoint);

          const response = await fetch(auditEndpoint, requestOptions);

          if (response.ok) {
            res.status(response.status).send(await response.json());
          } else {
            this.logger.warn('could not fetch audit: ' + JSON.stringify(await response.json()));
            res.status(response.status).end();
          }
        } catch (error) {
          this.logger.warn('could not fetch audit: ' + error);
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

    router.post('/audits', jsonParser({ limit: '10mb' }), handleAudit);
    router.post('/audits/quick', jsonParser({ limit: '10mb' }), handleAudit);

    router.post('/advisories/bulk', jsonParser({ limit: '10mb' }), handleAudit);

    app.use('/-/npm/v1/security', router);
  }
}
