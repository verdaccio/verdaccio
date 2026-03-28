import express from 'express';
import nock from 'nock';
import { join } from 'node:path';
import supertest from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';

import { HTTP_STATUS } from '../../local-storage/node_modules/@verdaccio/core/build';
import type { ConfigAudit } from '../src/index';
import ProxyAudit from '../src/index';

beforeAll(async () => {
  await setup({});
});

const auditConfig: ConfigAudit = {
  enabled: true,
} as ConfigAudit;

describe('Audit plugin', () => {
  test('should test audit', () => {
    const audit = new ProxyAudit(auditConfig, {
      logger,
      config: new Config(parseConfigFile(join(__dirname, 'config.yaml'))),
    });
    expect(audit).toBeDefined();
  });

  test('should test audit with configuration', () => {
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    expect(audit).toBeDefined();
    // expect(audit.strict_ssl).toBeFalsy();
  });

  test('should handle /-/npm/v1/security/audits/quick', async () => {
    const auditPayload = { webpack: ['5.88.2'], lodash: ['4.17.21'] };
    nock('https://registry.npmjs.org')
      .post('/-/npm/v1/security/audits/quick', (body) => {
        expect(body).toEqual(auditPayload);
        return true;
      })
      .reply(200, { foo: 'someData' });
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    audit.register_middlewares(app, {
      // @ts-ignore
      config: {
        https_proxy: '',
        http_proxy: '',
      },
    });
    await supertest(app)
      .post('/-/npm/v1/security/audits/quick')
      .send(auditPayload)
      .set('content-type', 'application/json')
      .expect(HTTP_STATUS.OK);
  });

  test('should handle /-/npm/v1/security/audits/bulk', async () => {
    const auditPayload = { jquery: ['3.7.1'], react: ['18.2.0'] };
    nock('https://registry.npmjs.org')
      .post('/-/npm/v1/security/advisories/bulk', (body) => {
        expect(body).toEqual(auditPayload);
        return true;
      })
      .reply(200, { foo: 'someData' });
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    audit.register_middlewares(app, {
      // @ts-ignore
      config: {
        https_proxy: '',
        http_proxy: '',
      },
    });
    await supertest(app)
      .post('/-/npm/v1/security/advisories/bulk')
      .send(auditPayload)
      .set('content-type', 'application/json')
      .expect(HTTP_STATUS.OK);
  });

  test('should handle /-/npm/v1/security/audits', async () => {
    const auditPayload = { acorn: ['8.10.0'] };
    nock('https://registry.npmjs.org')
      .post('/-/npm/v1/security/audits', (body) => {
        expect(body).toEqual(auditPayload);
        return true;
      })
      .reply(200, { foo: 'someData' });
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    audit.register_middlewares(app, {
      // @ts-ignore
      config: {
        https_proxy: '',
        http_proxy: '',
      },
    });
    await supertest(app)
      .post('/-/npm/v1/security/audits')
      .send(auditPayload)
      .set('content-type', 'application/json')
      .expect(HTTP_STATUS.OK);
  });

  test('should handle proxy', async () => {
    nock('https://registry.npmjs.org')
      .post('/-/npm/v1/security/audits/quick')
      .reply(200, { foo: 'someData' });
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    audit.register_middlewares(app, {
      // @ts-ignore
      config: {
        https_proxy: 'https://registry.proxy.org',
        http_proxy: '',
      },
    });
    await supertest(app)
      .post('/-/npm/v1/security/audits/quick')
      .send({ webpack: ['5.88.2'] })
      .set('content-type', 'application/json')
      .expect(HTTP_STATUS.OK);
  });
});
