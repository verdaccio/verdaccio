import express, { type Express, type Request, type Response } from 'express';
import got from 'got';
import { HttpsProxyAgent } from 'hpagent';
import { Agent as HttpsAgent } from 'node:https';

import type { Auth } from '@verdaccio/auth';
import { pluginUtils } from '@verdaccio/core';
import type { Logger } from '@verdaccio/types';

import type { ConfigAudit } from './types';

// FUTURE: we should be able to overwrite this
export const REGISTRY_DOMAIN = 'https://registry.npmjs.org';

export default class ProxyAudit
  extends pluginUtils.Plugin<ConfigAudit>
  implements pluginUtils.ExpressMiddleware<ConfigAudit, {}, Auth>
{
  public enabled: boolean;
  public logger: Logger;
  public strict_ssl: boolean;
  public timeout: number;

  public constructor(config: ConfigAudit, options: pluginUtils.PluginOptions) {
    super(config, options);
    this.enabled = config.enabled || false;
    this.strict_ssl = config.strict_ssl !== undefined ? config.strict_ssl : true;
    this.timeout = config.timeout ?? 1000 * 60 * 1;
    this.logger = options.logger;
  }

  public register_middlewares(app: Express, auth: Auth): void {
    const fetchAudit = async (
      req: Request,
      res: Response & { report_error?: Function }
    ): Promise<void> => {
      const headers: Record<string, string | string[] | undefined> = {};
      for (const [key, value] of Object.entries(req.headers)) {
        if (
          key === 'host' ||
          key === 'content-encoding' ||
          key === 'content-length' ||
          key === 'content-type' ||
          key === 'connection' ||
          key === 'transfer-encoding'
        ) {
          continue;
        }
        headers[key] = value;
      }
      headers['host'] = 'registry.npmjs.org';
      headers['accept-encoding'] = 'gzip,deflate,br';

      const agent = auth?.config?.https_proxy
        ? { https: new HttpsProxyAgent({ proxy: auth.config.https_proxy }) }
        : { https: new HttpsAgent({ rejectUnauthorized: this.strict_ssl }) };

      try {
        const auditEndpoint = `${REGISTRY_DOMAIN}${req.baseUrl}${req.route.path}`;
        this.logger.debug('fetching audit from ' + auditEndpoint);

        const controller = new AbortController();
        res.on('close', () => {
          if (!res.writableFinished) {
            controller.abort();
          }
        });

        const response = await got(auditEndpoint, {
          method: req.method as 'GET' | 'POST',
          headers,
          json: req.body,
          agent,
          signal: controller.signal,
          timeout: { request: this.timeout },
          retry: { limit: 0 },
          throwHttpErrors: false,
          responseType: 'json',
        });

        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(response.statusCode).send(response.body);
        } else {
          this.logger.warn('could not fetch audit: ' + JSON.stringify(response.body));
          res.status(response.statusCode).end();
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

    router.post('/audits', express.json({ limit: '10mb' }), handleAudit);
    router.post('/audits/quick', express.json({ limit: '10mb' }), handleAudit);

    router.post('/advisories/bulk', express.json({ limit: '10mb' }), handleAudit);

    app.use('/-/npm/v1/security', router);
  }
}
