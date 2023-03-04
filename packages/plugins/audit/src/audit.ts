import express, { Express, Request, Response } from 'express';
import https from 'https';
import createHttpsProxyAgent from 'https-proxy-agent';
import fetch from 'node-fetch';

import type { Auth } from '@verdaccio/auth';
import { pluginUtils } from '@verdaccio/core';
import { Logger } from '@verdaccio/types';

import { ConfigAudit } from './types';

// FUTURE: we should be able to overwrite this
export const REGISTRY_DOMAIN = 'https://registry.npmjs.org';

export default class ProxyAudit
  extends pluginUtils.Plugin<ConfigAudit>
  implements pluginUtils.ExpressMiddleware<ConfigAudit, {}, Auth>
{
  public enabled: boolean;
  public logger: Logger;
  public strict_ssl: boolean;

  public constructor(config: ConfigAudit, options: pluginUtils.PluginOptions) {
    super(config, options);
    this.enabled = config.enabled || false;
    this.strict_ssl = config.strict_ssl !== undefined ? config.strict_ssl : true;
    this.logger = options.logger;
  }

  public register_middlewares(app: Express, auth: Auth): void {
    const fetchAudit = async (
      req: Request,
      res: Response & { report_error?: Function }
    ): Promise<void> => {
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
    };

    const handleAudit = async (req: Request, res: Response): Promise<void> => {
      if (this.enabled) {
        await fetchAudit(req, res);
      } else {
        res.status(500).end();
      }
    };

    /* eslint new-cap:off */
    const router = express.Router();
    /* eslint new-cap:off */

    router.post('/audits', express.json({ limit: '10mb' }), handleAudit);
    router.post('/audits/quick', express.json({ limit: '10mb' }), handleAudit);

    router.post('/advisories/bulk', express.json({ limit: '10mb' }), handleAudit);

    app.use('/-/npm/v1/security', router);
  }
}
