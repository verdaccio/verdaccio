import express from 'express';
import nock from 'nock';
import { join } from 'path';
import supertest from 'supertest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';

import { HTTP_STATUS } from '../../local-storage/node_modules/@verdaccio/core/build';
import ProxyAudit, { ConfigAudit } from '../src/index';

setup({});

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
    nock('https://registry.npmjs.org')
      .post('/-/npm/v1/security/audits/quick')
      .reply(200, { foo: 'someData' });
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    const app = express();
    audit.register_middlewares(app, {
      // @ts-ignore
      config: {
        https_proxy: '',
        http_proxy: '',
      },
    });
    await supertest(app).post('/-/npm/v1/security/audits/quick').expect(HTTP_STATUS.OK);
  });

  test('should handle /-/npm/v1/security/audits/bulk', async () => {
    nock('https://registry.npmjs.org')
      .post('/-/npm/v1/security/advisories/bulk')
      .reply(200, { foo: 'someData' });
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    const app = express();
    audit.register_middlewares(app, {
      // @ts-ignore
      config: {
        https_proxy: '',
        http_proxy: '',
      },
    });
    await supertest(app).post('/-/npm/v1/security/advisories/bulk').expect(HTTP_STATUS.OK);
  });

  test('should handle /-/npm/v1/security/audits', async () => {
    nock('https://registry.npmjs.org')
      .post('/-/npm/v1/security/audits')
      .reply(200, { foo: 'someData' });
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    const app = express();
    audit.register_middlewares(app, {
      // @ts-ignore
      config: {
        https_proxy: '',
        http_proxy: '',
      },
    });
    await supertest(app).post('/-/npm/v1/security/audits').expect(HTTP_STATUS.OK);
  });

  test('should handle proxy', async () => {
    nock('https://registry.npmjs.org')
      .post('/-/npm/v1/security/audits/quick')
      .reply(200, { foo: 'someData' });
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(auditConfig, { logger, config: config });
    const app = express();
    audit.register_middlewares(app, {
      // @ts-ignore
      config: {
        https_proxy: 'https://registry.proxy.org',
        http_proxy: '',
      },
    });
    await supertest(app).post('/-/npm/v1/security/audits/quick').expect(HTTP_STATUS.OK);
  });
});
