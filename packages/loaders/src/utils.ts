import buildDebug from 'debug';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { pluginUtils } from '@verdaccio/core';

const debug = buildDebug('verdaccio:plugin:loader:utils');
const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';
const ERR_REQUIRE_ESM = 'ERR_REQUIRE_ESM';

export type PluginType<T> = T extends pluginUtils.Plugin<T> ? T : never;

export function isValid<T>(plugin: PluginType<T>): boolean {
  // @ts-expect-error default not relevant
  return typeof plugin === 'function' || typeof plugin.default === 'function';
}

export function isES6<T>(plugin: PluginType<T>): boolean {
  return Object.keys(plugin).includes('default');
}

/**
 * Requires a module.
 * @param {*} path the module's path
 * @return {Object}
 */
export function tryLoad<T>(path: string, onError: any): PluginType<T> | null {
  try {
    debug('loading plugin %s', path);
    return require(path) as PluginType<T>;
  } catch (err: any) {
    if (err.code === MODULE_NOT_FOUND) {
      debug('"require" failed for plugin %s', path);
      // If loading fails, because a dependency is missing,
      // we want to log the error message and require stack
      // to see where the missing dependency is.
      const message = err.message.replace(/\\\\/g, '\\').split('\n');
      if (!message[0].includes(path)) {
        debug('%o', message[0]); // error message
        debug('%o', message.slice(1)); // stack trace
      }
      return null;
    }
    if (err.code === ERR_REQUIRE_ESM) {
      debug('"require" failed for ESM plugin %s, will try dynamic import', path);
      return null;
    }
    onError({ err: err.msg }, 'error loading plugin @{err}');
    throw err;
  }
}

/**
 * Resolve the entry point for a directory-based plugin.
 * dynamic import() does not support directory imports, so we need to
 * find the actual file to import (via package.json "main"/"exports" or index.js).
 */
function resolveEntryPoint(dirPath: string): string {
  const pkgPath = join(dirPath, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      // Check exports first, then module, then main
      if (pkg.exports) {
        const dotExport = pkg.exports['.'];
        if (typeof dotExport === 'string') {
          return join(dirPath, dotExport);
        }
        if (dotExport?.import?.default) {
          return join(dirPath, dotExport.import.default);
        }
        if (dotExport?.import) {
          return join(dirPath, typeof dotExport.import === 'string' ? dotExport.import : '');
        }
        if (dotExport?.default) {
          return join(dirPath, dotExport.default);
        }
      }
      if (pkg.module) {
        return join(dirPath, pkg.module);
      }
      if (pkg.main) {
        return join(dirPath, pkg.main);
      }
    } catch {
      // fall through to index.js
    }
  }
  return join(dirPath, 'index.js');
}

/**
 * Dynamically imports a module (supports ESM plugins).
 * Falls back from require() to import() for ESM compatibility.
 * @param {*} path the module's path
 * @return {Object}
 */
export async function tryLoadAsync<T>(path: string, onError: any): Promise<PluginType<T> | null> {
  // Try require first (handles CJS and will be fast)
  try {
    const cjsResult = tryLoad<T>(path, onError);
    if (cjsResult !== null) {
      return cjsResult;
    }
  } catch (err: any) {
    // require() may throw for various reasons (ESM module, bundler shim, etc.)
    // — always fall through to dynamic import()
    debug('require() threw for %s: %s — falling back to import()', path, err.message);
  }

  // Fallback to dynamic import for ESM modules
  try {
    // import() doesn't support directory imports — resolve the entry point
    let importPath = path;
    if (existsSync(path) && existsSync(join(path, 'package.json'))) {
      importPath = resolveEntryPoint(path);
      debug('resolved ESM entry point: %s', importPath);
    }

    // Convert to file URL for import() compatibility
    const importUrl = importPath.startsWith('/') ? pathToFileURL(importPath).href : importPath;
    debug('trying dynamic import for plugin %s', importUrl);
    const module = await import(importUrl);
    debug('dynamic import succeeded for plugin %s', importUrl);
    return module as PluginType<T>;
  } catch (err: any) {
    if (err.code === MODULE_NOT_FOUND || err.code === 'ERR_MODULE_NOT_FOUND') {
      debug('"import" failed for plugin %s', path);
      return null;
    }
    onError({ err: err.message }, 'error loading plugin @{err}');
    throw err;
  }
}
