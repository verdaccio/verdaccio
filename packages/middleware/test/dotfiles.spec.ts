import request from 'supertest';
import { describe, test } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import { dotfiles } from '../src';
import { getApp } from './helper';

describe('dotfiles middleware', () => {
  describe('policy: deny (default)', () => {
    test('should return 403 for dotfile path segment', async () => {
      const app = getApp([dotfiles('deny')]);
      app.get('/{*any}', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/.well-known/something').expect(HTTP_STATUS.FORBIDDEN);
    });

    test('should return 403 for .env', async () => {
      const app = getApp([dotfiles('deny')]);
      app.get('/{*any}', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/.env').expect(HTTP_STATUS.FORBIDDEN);
    });

    test('should return 403 for nested dotfile path', async () => {
      const app = getApp([dotfiles('deny')]);
      app.get('/{*any}', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/some/.git/config').expect(HTTP_STATUS.FORBIDDEN);
    });

    test('should pass through normal paths', async () => {
      const app = getApp([dotfiles('deny')]);
      app.get('/package', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/package').expect(HTTP_STATUS.OK);
    });

    test('should pass through verdaccio internal paths', async () => {
      const app = getApp([dotfiles('deny')]);
      app.get('/-/static/main.js', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/-/static/main.js').expect(HTTP_STATUS.OK);
    });

    test('should not block files with dots in the name', async () => {
      const app = getApp([dotfiles('deny')]);
      app.get('/-/static/main.abc123.js', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/-/static/main.abc123.js').expect(HTTP_STATUS.OK);
    });
  });

  describe('policy: ignore', () => {
    test('should return 404 for dotfile path segment', async () => {
      const app = getApp([dotfiles('ignore')]);
      app.get('/{*any}', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/.well-known/something').expect(HTTP_STATUS.NOT_FOUND);
    });

    test('should pass through normal paths', async () => {
      const app = getApp([dotfiles('ignore')]);
      app.get('/package', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/package').expect(HTTP_STATUS.OK);
    });
  });

  describe('policy: allow', () => {
    test('should pass through dotfile path segments', async () => {
      const app = getApp([dotfiles('allow')]);
      app.get('/{*any}', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/.well-known/something').expect(HTTP_STATUS.OK);
    });
  });

  describe('default policy', () => {
    test('should default to ignore', async () => {
      const app = getApp([dotfiles()]);
      app.get('/{*any}', (_req, res) => res.status(HTTP_STATUS.OK).json({}));

      return request(app).get('/.env').expect(HTTP_STATUS.NOT_FOUND);
    });
  });
});
