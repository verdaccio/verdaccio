import { Logger } from '@verdaccio/types';

import ProxyAudit, { ConfigAudit } from '../src/index';

const config: ConfigAudit = {
  enabled: true,
} as ConfigAudit;

const logger: Logger = {
  error: (e) => console.warn(e),
  info: (e) => console.warn(e),
  debug: (e) => console.warn(e),
  child: (e) => console.warn(e),
  warn: () => {},
  http: (e) => console.warn(e),
  trace: (e) => console.warn(e),
};

describe('Audit plugin', () => {
  test('should test audit', () => {
    const audit = new ProxyAudit(config, { logger, config: undefined });
    expect(audit).toBeDefined();
  });

  test('should test audit with configuration', () => {
    const config = { strict_ssl: false } as ConfigAudit;
    const audit = new ProxyAudit(config, { logger, config: config });
    expect(audit).toBeDefined();
    expect(audit.strict_ssl).toBeFalsy();
  });
});
