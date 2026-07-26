import buildDebug from 'debug';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import type { pluginUtils } from '@verdaccio/core';

const debug = buildDebug('verdaccio:plugin:loader:utils');
const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';
const ERR_REQUIRE_ESM = 'ERR_REQUIRE_ESM';
// thrown by require(esm) when the module uses top-level await
const ERR_REQUIRE_ASYNC_MODULE = 'ERR_REQUIRE_ASYNC_MODULE';

// the ESM build has no ambient require; create one so CJS plugins keep loading.
// rolldown rewrites bare `require` to a throwing stub in the ESM output and
// lowers `import.meta` to `{}` in the CJS output, so `import.meta.url` is only
// truthy in the ESM build; module-scoped __filename covers the CJS build
// (checking `typeof __filename`/`typeof require` instead is unsafe: node -e and
// the REPL leak both as globals into ES modules)
const requireModule = import.meta.url ? createRequire(import.meta.url) : createRequire(__filename);

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
    return requireModule(path) as PluginType<T>;
  } catch (err: any) {
    if (err.code === MODULE_NOT_FOUND) {
      debug('"require" failed for plugin %s', path);
      const message = err.message.replace(/\\\\/g, '\\').split('\n');
      if (!message[0].includes(path)) {
        // the plugin itself was found but one of its own dependencies is
        // missing: that is a real load error — reporting "not found" (and
        // re-evaluating the plugin through the import() fallback) would mask
        // the actual cause and run its side effects twice
        debug('%o', message[0]); // error message
        debug('%o', message.slice(1)); // stack trace
        onError({ err: err.message }, 'error loading plugin @{err}');
        throw err;
      }
      return null;
    }
    if (err.code === ERR_REQUIRE_ESM || err.code === ERR_REQUIRE_ASYNC_MODULE) {
      debug('"require" failed for ESM plugin %s, will try dynamic import', path);
      return null;
    }
    onError({ err: err.message }, 'error loading plugin @{err}');
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
      // Check exports first, then module, then main; only string entries are
      // usable paths — condition objects without them fall through to the
      // next field (otherwise we would return the directory itself, which
      // dynamic import() rejects)
      if (pkg.exports) {
        // exports may use the sugar form with conditions at the top level
        // instead of a '.' subpath map
        const dotExport = pkg.exports['.'] ?? pkg.exports;
        if (typeof dotExport === 'string') {
          return join(dirPath, dotExport);
        }
        if (typeof dotExport?.import === 'string') {
          return join(dirPath, dotExport.import);
        }
        if (typeof dotExport?.import?.default === 'string') {
          return join(dirPath, dotExport.import.default);
        }
        if (typeof dotExport?.default === 'string') {
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
    // tryLoad() returns null for the not-found / ESM cases and only throws on
    // a real load error (the plugin itself failed to evaluate); retrying via
    // import() would run the plugin's side effects twice and mask the error
    debug('require() threw a real load error for %s: %s', path, err.message);
    throw err;
  }

  // Fallback to dynamic import for ESM modules
  // import() doesn't support directory imports — resolve the entry point,
  // also for manifest-less directory plugins that only ship an index.js
  let importPath = path;
  try {
    if (
      isAbsolute(path) &&
      (existsSync(join(path, 'package.json')) || existsSync(join(path, 'index.js')))
    ) {
      importPath = resolveEntryPoint(path);
      debug('resolved ESM entry point: %s', importPath);
    }

    // Convert to file URL for import() compatibility (isAbsolute also covers
    // Windows paths like C:\..., which startsWith('/') would miss)
    const importUrl = isAbsolute(importPath) ? pathToFileURL(importPath).href : importPath;
    debug('trying dynamic import for plugin %s', importUrl);
    const module = await import(importUrl);
    debug('dynamic import succeeded for plugin %s', importUrl);
    return module as PluginType<T>;
  } catch (err: any) {
    if (err.code === 'ERR_UNSUPPORTED_DIR_IMPORT') {
      // only the plugin path itself is ever imported as a directory
      debug('"import" failed for plugin %s', path);
      return null;
    }
    if (err.code === MODULE_NOT_FOUND || err.code === 'ERR_MODULE_NOT_FOUND') {
      // "not found" may refer to the plugin itself (plugin not installed:
      // return null) or to a missing dependency inside an existing plugin —
      // a real load error that must surface, mirroring the require() path
      // the missing specifier may be reported as a file:// URL
      const missingRaw = /Cannot find (?:module|package) '([^']+)'/.exec(err.message)?.[1];
      const missing = missingRaw?.startsWith('file://') ? fileURLToPath(missingRaw) : missingRaw;
      const refersToPlugin =
        missing === undefined ||
        missing === path ||
        missing === importPath ||
        missing.startsWith(path);
      if (refersToPlugin) {
        debug('"import" failed for plugin %s', path);
        return null;
      }
      debug('plugin %s exists but its dependency %s is missing', path, missing);
    }
    onError({ err: err.message }, 'error loading plugin @{err}');
    throw err;
  }
}
