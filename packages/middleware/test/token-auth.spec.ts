import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';
import { type Mock, beforeEach, describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
import type { Logger, Token } from '@verdaccio/types';

import { type TokenReadableStorage, enforceGeneratedTokenMetadata } from '../src';

type RemoteUser = { name?: unknown; token?: { key: string } };

function buildRemoteUser(options: { tokenKey?: string; user?: unknown } = {}): RemoteUser {
  const user = 'user' in options ? options.user : 'jota';

  if (typeof options.tokenKey === 'undefined') {
    return { name: user };
  }

  return { name: user, token: { key: options.tokenKey } };
}

function buildToken(overrides: Partial<Token> = {}): Token {
  return {
    user: 'jota',
    token: 'masked',
    key: 'abc123',
    readonly: false,
    created: 1,
    ...overrides,
  } as Token;
}

function buildApp(
  storage: TokenReadableStorage,
  logger: Logger,
  remoteUser: RemoteUser,
  clientIp?: string,
  trustProxy?: boolean | string | number
): Application {
  const app = express();
  // mirrors Verdaccio wiring `config.server.trustProxy` -> app.set('trust proxy')
  if (typeof trustProxy !== 'undefined') {
    app.set('trust proxy', trustProxy);
  }
  app.use((req: Request, _res: Response, next: NextFunction) => {
    (req as any).remote_user = remoteUser;
    // `req.ip` is a read-only accessor derived from the socket; shadow it to
    // provide a deterministic client address for these tests
    if (typeof clientIp !== 'undefined') {
      Object.defineProperty(req, 'ip', { value: clientIp, configurable: true });
    }
    next();
  });
  app.use(enforceGeneratedTokenMetadata(storage, logger));
  app.use((_req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({ ok: true });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || HTTP_STATUS.INTERNAL_ERROR).json({ error: err.message });
  });
  return app;
}

describe('enforceGeneratedTokenMetadata', () => {
  let readTokens: Mock;
  let storage: TokenReadableStorage;
  let logger: Logger;

  beforeEach(() => {
    readTokens = vi.fn();
    storage = { readTokens } as unknown as TokenReadableStorage;
    logger = { warn: vi.fn(), error: vi.fn() } as unknown as Logger;
  });

  test('passes through when the request carries no generated token key', async () => {
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: undefined }));

    await request(app).put('/').expect(HTTP_STATUS.OK);

    expect(readTokens).not.toHaveBeenCalled();
  });

  test('rejects when a token key is present but the user is not a string', async () => {
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123', user: undefined }));

    await request(app).put('/').expect(HTTP_STATUS.FORBIDDEN);

    expect(readTokens).not.toHaveBeenCalled();
  });

  test('looks the token up scoped to the authenticated user', async () => {
    readTokens.mockResolvedValue([buildToken()]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123', user: 'jota' }));

    await request(app).get('/').expect(HTTP_STATUS.OK);

    expect(readTokens).toHaveBeenCalledWith({ user: 'jota' });
  });

  test('rejects when the generated token is missing (revoked)', async () => {
    readTokens.mockResolvedValue([buildToken({ key: 'another-key' })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }));

    await request(app).put('/').expect(HTTP_STATUS.FORBIDDEN);

    expect(logger.warn).toHaveBeenCalled();
  });

  test('rejects when the client address is outside the token CIDR whitelist', async () => {
    readTokens.mockResolvedValue([buildToken({ cidr: ['203.0.113.0/24'] })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }), '198.51.100.5');

    await request(app).put('/').expect(HTTP_STATUS.FORBIDDEN);

    expect(logger.warn).toHaveBeenCalled();
  });

  test('allows when the client address is inside the token CIDR whitelist', async () => {
    readTokens.mockResolvedValue([buildToken({ cidr: ['203.0.113.0/24'] })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }), '203.0.113.5');

    await request(app).get('/').expect(HTTP_STATUS.OK);
  });

  test('ignores a spoofed x-forwarded-for when trust proxy is not configured', async () => {
    // SECURITY: with no trust proxy, the forwarded header is attacker-controlled
    // and must NOT satisfy the CIDR whitelist. The real socket address
    // (198.51.100.5) is outside the range, so the request is rejected even
    // though the header claims an allowed address.
    readTokens.mockResolvedValue([buildToken({ cidr: ['203.0.113.0/24'] })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }), '198.51.100.5');

    await request(app).put('/').set('x-forwarded-for', '203.0.113.5').expect(HTTP_STATUS.FORBIDDEN);

    expect(logger.warn).toHaveBeenCalled();
  });

  test('falls back to req.ip for the CIDR check when no x-forwarded-for is present', async () => {
    readTokens.mockResolvedValue([buildToken({ cidr: ['203.0.113.0/24'] })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }), '203.0.113.5');

    await request(app).get('/').expect(HTTP_STATUS.OK);
  });

  test('rejects via the req.ip fallback when the address is outside the CIDR whitelist', async () => {
    readTokens.mockResolvedValue([buildToken({ cidr: ['203.0.113.0/24'] })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }), '198.51.100.5');

    await request(app).get('/').expect(HTTP_STATUS.FORBIDDEN);

    expect(logger.warn).toHaveBeenCalled();
  });

  test('honors x-forwarded-for for the CIDR check when trust proxy is configured', async () => {
    readTokens.mockResolvedValue([buildToken({ cidr: ['203.0.113.0/24'] })]);
    // trust proxy enabled -> req.ip is derived from the forwarded chain
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }), undefined, true);

    await request(app).get('/').set('x-forwarded-for', '203.0.113.5').expect(HTTP_STATUS.OK);
  });

  test('rejects an out-of-range x-forwarded-for even when trust proxy is configured', async () => {
    readTokens.mockResolvedValue([buildToken({ cidr: ['203.0.113.0/24'] })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }), undefined, true);

    await request(app)
      .put('/')
      .set('x-forwarded-for', '198.51.100.5')
      .expect(HTTP_STATUS.FORBIDDEN);

    expect(logger.warn).toHaveBeenCalled();
  });

  test('uses the upstream-most forwarded entry when trust proxy is configured', async () => {
    readTokens.mockResolvedValue([buildToken({ cidr: ['203.0.113.0/24'] })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }), undefined, true);

    await request(app)
      .get('/')
      .set('x-forwarded-for', '203.0.113.5, 70.41.3.18')
      .expect(HTTP_STATUS.OK);
  });

  test.each(['delete', 'patch', 'post', 'put'])(
    'rejects a readonly token on write method %s',
    async (method) => {
      readTokens.mockResolvedValue([buildToken({ readonly: true })]);
      const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }));

      await request(app)[method]('/').expect(HTTP_STATUS.FORBIDDEN);

      expect(logger.warn).toHaveBeenCalled();
    }
  );

  test('allows a readonly token on a read request', async () => {
    readTokens.mockResolvedValue([buildToken({ readonly: true })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }));

    await request(app).get('/').expect(HTTP_STATUS.OK);
  });

  test('allows a write request made with a non-readonly token', async () => {
    readTokens.mockResolvedValue([buildToken({ readonly: false })]);
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }));

    await request(app).put('/').expect(HTTP_STATUS.OK);
  });

  test('fails closed with an internal error when the token lookup throws', async () => {
    readTokens.mockRejectedValue(new Error('storage down'));
    const app = buildApp(storage, logger, buildRemoteUser({ tokenKey: 'abc123' }));

    await request(app).put('/').expect(HTTP_STATUS.INTERNAL_ERROR);

    expect(logger.error).toHaveBeenCalled();
  });
});
