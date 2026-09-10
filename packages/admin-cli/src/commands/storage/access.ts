import fs from 'node:fs/promises';
import path from 'node:path';

import { getMiddlewareCredentials } from '@verdaccio/auth';
import type { Auth } from '@verdaccio/auth';
import { createAnonymousRemoteUser } from '@verdaccio/config';
import type { Config } from '@verdaccio/config';
import { STORAGE } from '@verdaccio/store';
import type { Manifest, RemoteUser } from '@verdaccio/types';

/** Minimal storage-plugin surface the cache removal needs (keeps it testable). */
export interface CachePackageHandler {
  deletePackage(fileName: string): Promise<void>;
  removePackage(name?: string): Promise<void>;
  /** filesystem path of the package folder, when the plugin exposes it */
  path?: string;
}
export interface CacheStoragePlugin {
  getPackageStorage(pkgName: string): CachePackageHandler;
  remove(pkgName: string): Promise<void>;
}

/**
 * Resolve the operator identity from an auth token, so every storage operation
 * can be gated by the same package-access ACL the registry enforces.
 *
 * No token → anonymous (the ACL still applies). Only JWT tokens are supported;
 * legacy AES tokens are rejected with a clear message.
 */
export function resolveRemoteUser(config: Config, token?: string): RemoteUser {
  if (!token) {
    return createAnonymousRemoteUser();
  }
  const credentials = getMiddlewareCredentials(config.security, config.secret, `Bearer ${token}`);
  if (credentials && Array.isArray((credentials as RemoteUser).groups)) {
    return credentials as RemoteUser;
  }
  throw new Error(
    'unable to resolve the auth token: only JWT tokens are supported (omit --token to act anonymously)'
  );
}

/** Log in with username/password against the configured auth plugin (e.g. htpasswd). */
export function authenticateUser(
  auth: Auth,
  username: string,
  password: string
): Promise<RemoteUser> {
  return new Promise((resolve, reject) => {
    auth.authenticate(username, password, (error, user) => {
      if (error || !user) {
        reject(new Error(`authentication failed for user "${username}"`));
      } else {
        resolve(user);
      }
    });
  });
}

/** Whether the user is allowed to read the package (ACL `access`). */
export function canAccess(auth: Auth, user: RemoteUser, packageName: string): Promise<boolean> {
  return new Promise((resolve) => {
    auth.allow_access({ packageName }, user, (error, allowed) => {
      resolve(!error && allowed === true);
    });
  });
}

/** Whether the user is allowed to remove the package (ACL `unpublish`). */
export function canRemove(auth: Auth, user: RemoteUser, packageName: string): Promise<boolean> {
  return new Promise((resolve) => {
    auth.allow_unpublish({ packageName }, user, (error, allowed) => {
      resolve(!error && allowed === true);
    });
  });
}

/**
 * A package is treated as pure uplink cache (safe to clean) when it carries
 * uplink sync bookkeeping and has no locally published tarballs.
 */
export function isCachedPackage(manifest: Manifest): boolean {
  const hasUplinks = Boolean(manifest._uplinks) && Object.keys(manifest._uplinks).length > 0;
  const hasAttachments =
    Boolean(manifest._attachments) && Object.keys(manifest._attachments).length > 0;
  return hasUplinks && !hasAttachments;
}

/** Cached tarball file names for a package, derived from each version's dist.tarball. */
export function getCachedTarballNames(manifest: Manifest): string[] {
  const names = new Set<string>();
  for (const version of Object.values(manifest.versions ?? {})) {
    const tarball = version?.dist?.tarball;
    if (tarball) {
      names.add(tarball.substring(tarball.lastIndexOf('/') + 1));
    }
  }
  return [...names];
}

/**
 * Fully remove a cached package: its tarball files, its package.json, the folder
 * and the database entry. `rmdir` is not recursive, so files go first. Missing
 * files (ENOENT) are ignored so a partially cleaned package still finishes.
 */
export async function removeCachedPackage(
  plugin: CacheStoragePlugin,
  name: string,
  tarballs: string[]
): Promise<void> {
  const handler = plugin.getPackageStorage(name);
  for (const file of [...tarballs, STORAGE.PACKAGE_FILE_NAME]) {
    try {
      await handler.deletePackage(file);
    } catch (err: any) {
      if (err?.code !== 'ENOENT') {
        throw err;
      }
    }
  }
  await handler.removePackage(name);
  await plugin.remove(name);

  // a scoped package leaves its `@scope` directory behind; remove it when empty
  if (name.startsWith('@') && name.includes('/') && typeof handler.path === 'string') {
    try {
      await fs.rmdir(path.dirname(handler.path));
    } catch {
      // scope still holds other packages, or is already gone
    }
  }
}
