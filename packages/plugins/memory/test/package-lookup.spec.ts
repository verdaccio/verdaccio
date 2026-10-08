import { beforeAll, describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import MemoryHandler from '../src/memory-handler';
import pkgExample from './partials/pkg';

beforeAll(async () => {
  await setup({});
});

describe.each(['constructor', 'toString', 'hasOwnProperty', 'missing-package'])(
  'package lookup for %s',
  (name) => {
    test('should not report an inherited entry as a stored package', async () => {
      const handler = new MemoryHandler(name, {}, logger);
      await expect(handler.hasPackage(name)).resolves.toBe(false);
    });

    test('should return 404 when reading an absent package', async () => {
      const handler = new MemoryHandler(name, {}, logger);
      await expect(handler.readPackage(name)).rejects.toMatchObject({
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
    });

    test('should return 404 without updating an absent package', async () => {
      const handler = new MemoryHandler(name, {}, logger);
      const update = vi.fn();
      await expect(handler.updatePackage(name, update)).rejects.toMatchObject({
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
      expect(update).not.toHaveBeenCalled();
    });

    test('should create, read, update and remove an explicitly stored package', async () => {
      const handler = new MemoryHandler(name, {}, logger);
      const manifest = { ...pkgExample, name };
      await handler.createPackage(name, manifest);
      await expect(handler.hasPackage(name)).resolves.toBe(true);
      await expect(handler.readPackage(name)).resolves.toEqual(manifest);
      await expect(handler.updatePackage(name, async (pkg) => pkg)).resolves.toEqual(manifest);
      await handler.removePackage(name);
      await expect(handler.hasPackage(name)).resolves.toBe(false);
      await expect(handler.readPackage(name)).rejects.toMatchObject({
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
    });
  }
);
