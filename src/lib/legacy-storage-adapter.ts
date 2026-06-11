import buildDebug from 'debug';
import { Writable } from 'node:stream';

import { Logger } from '@verdaccio/types';

const debug = buildDebug('verdaccio:storage:legacy-adapter');

/**
 * Compatibility shim that lets a LEGACY callback/stream based storage plugin
 * (the `@verdaccio/local-storage-legacy` contract used by Verdaccio < 8 and by
 * many third-party plugins) be driven by the promise-based `@verdaccio/store`.
 *
 * `@verdaccio/store` awaits every storage method:
 *   await plugin.get() / add(name) / remove(name) / search(query)
 *   const h = plugin.getPackageStorage(name)
 *   await h.readPackage(name) / savePackage(name, v) / createPackage(...) /
 *         deletePackage(file) / removePackage() / hasPackage() /
 *         hasTarball(file) / writeTarball(file, {signal}) /
 *         readTarball(file, {signal}) / updatePackage(name, handleUpdate)
 *
 * The legacy contract is callback/stream based instead, so we promisify it.
 * New (promise) plugins are detected and returned untouched — zero overhead on
 * the default path.
 */

type AnyFn = (...args: any[]) => any;

/** Resolve an error-first callback method into a promise. */
function fromCallback<T = any>(invoke: (cb: (err: any, data?: T) => void) => void): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    invoke((err, data) => (err ? reject(err) : resolve(data as T)));
  });
}

/**
 * Detect a legacy callback-based storage plugin. The new contract's `get()`
 * takes no arguments (returns a promise); the legacy `get(cb)` declares a
 * trailing callback, and `add(name, cb)` takes two. Arity is a stable signal
 * here because both contracts are frozen.
 */
export function isLegacyStoragePlugin(plugin: any): boolean {
  if (!plugin || typeof plugin.get !== 'function') {
    return false;
  }
  const getIsCallback = plugin.get.length >= 1;
  const addIsCallback = typeof plugin.add === 'function' && plugin.add.length >= 2;
  return getIsCallback || addIsCallback;
}

/** Synthesize the new `hasPackage()` from legacy `readPackage(name, cb)`. */
function hasPackage(handler: any, pkgName: string): Promise<boolean> {
  return new Promise((resolve) => {
    handler.readPackage(pkgName, (err: any) => resolve(!err));
  });
}

/**
 * Synthesize the new `hasTarball(file)` from a legacy `readTarball` stream:
 * open => exists, 404/ENOENT error => missing. Mirrors the old
 * `Storage.hasLocalTarball` probe.
 */
function hasTarball(handler: any, fileName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let stream: any = handler.readTarball(fileName);
    let isOpen = false;
    stream.on('error', (err: any) => {
      const notFound = err?.code === 'ENOENT' || err?.status === 404;
      if (isOpen || !notFound) {
        // a real read error after the file was already opened
        if (!isOpen) {
          resolve(false);
        } else {
          reject(err);
        }
      } else {
        resolve(false);
      }
      stream?.abort?.();
      stream = null;
    });
    stream.on('open', () => {
      isOpen = true;
      stream.abort?.();
      stream = null;
      resolve(true);
    });
  });
}

/**
 * Bridge legacy `readTarball(name) => ReadTarball` to the promise contract.
 * The legacy object is already a Readable that emits `content-length`/`open`/
 * `error`, so it can be handed back as-is; we only wire abort to the signal.
 */
function readTarball(handler: any, fileName: string, options: { signal?: AbortSignal } = {}) {
  const stream = handler.readTarball(fileName);
  const { signal } = options;
  if (signal) {
    if (signal.aborted) {
      stream.abort?.();
    } else {
      signal.addEventListener('abort', () => stream.abort?.(), { once: true });
    }
  }
  return Promise.resolve(stream);
}

/**
 * Bridge legacy `writeTarball(name) => UploadTarball` to a Node Writable that
 * `@verdaccio/store` can use in `pipeline()`:
 *  - the legacy stream finalizes only when `.done()` is called (ends temp file,
 *    renames it into place, then emits `success`); store instead ends the
 *    stream and waits for `close`.
 *  - so we forward writes to the legacy stream, call `.done()` on `_final`, and
 *    only complete (emit `close`) once the legacy stream emits `success`.
 */
function writeTarball(handler: any, fileName: string, options: { signal?: AbortSignal } = {}) {
  const upload = handler.writeTarball(fileName);
  const { signal } = options;

  const bridge = new Writable({
    write(chunk, _enc, cb): void {
      if (upload.write(chunk)) {
        cb();
      } else {
        upload.once('drain', cb);
      }
    },
    final(cb): void {
      upload.once('success', () => cb());
      upload.once('error', (err: any) => cb(err));
      // `done()` waits for the legacy stream's `end`, so end it first.
      upload.end();
      upload.done();
    },
  });

  upload.on('open', () => bridge.emit('open'));
  upload.on('error', (err: any) => bridge.destroy(err));

  if (signal) {
    const onAbort = (): void => {
      upload.abort?.();
      bridge.destroy(new Error('tarball upload aborted'));
    };
    if (signal.aborted) {
      onAbort();
    } else {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  }
  return Promise.resolve(bridge);
}

/**
 * Bridge legacy 5-arg `updatePackage(name, updateHandler, onWrite,
 * transformPackage, onEnd)` to the new 2-arg `updatePackage(name, handleUpdate)`
 * where `handleUpdate(manifest) => Promise<manifest>`. The store persists the
 * result itself (via `writePackage`/`savePackage`), so `onWrite` is a no-op:
 * we only read-lock, run the handler, and unlock.
 */
function updatePackage(handler: any, name: string, handleUpdate: AnyFn): Promise<any> {
  return new Promise((resolve, reject) => {
    let updated: any;
    handler.updatePackage(
      name,
      // updateHandler(json, cb): run the promise handler, capture the result
      (json: any, cb: (err?: any) => void) => {
        Promise.resolve(handleUpdate(json))
          .then((result) => {
            updated = result;
            cb();
          })
          .catch(cb);
      },
      // onWrite(name, data, cb): store persists separately, so just unlock
      (_name: string, _data: any, cb: (err?: any) => void) => cb(),
      // transformPackage(json): return the updated manifest
      (json: any) => updated ?? json,
      // onEnd(err)
      (err: any) => (err ? reject(err) : resolve(updated))
    );
  });
}

/** Wrap a legacy per-package storage handler in the promise contract. */
function wrapLegacyHandler(handler: any): any {
  if (!handler) {
    return handler;
  }
  return {
    readPackage: (name: string) => fromCallback((cb) => handler.readPackage(name, cb)),
    createPackage: (name: string, manifest: any) =>
      fromCallback((cb) => handler.createPackage(name, manifest, cb)),
    savePackage: (name: string, value: any) =>
      fromCallback((cb) => handler.savePackage(name, value, cb)),
    deletePackage: (fileName: string) => fromCallback((cb) => handler.deletePackage(fileName, cb)),
    removePackage: () => fromCallback((cb) => handler.removePackage(cb)),
    hasPackage: (name?: string) => hasPackage(handler, name as string),
    hasTarball: (fileName: string) => hasTarball(handler, fileName),
    readTarball: (fileName: string, options?: { signal?: AbortSignal }) =>
      readTarball(handler, fileName, options),
    writeTarball: (fileName: string, options?: { signal?: AbortSignal }) =>
      writeTarball(handler, fileName, options),
    updatePackage: (name: string, handleUpdate: AnyFn) =>
      updatePackage(handler, name, handleUpdate),
  };
}

/** Collect a legacy streaming `search(onPackage, onEnd, validate)` into a list. */
function search(plugin: any, query: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const items: any[] = [];
    try {
      plugin.search(
        (item: any, done: () => void) => {
          items.push(item);
          done();
        },
        (err: any) => (err ? reject(err) : resolve(items)),
        () => true
      );
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Wrap a legacy callback storage plugin in the promise contract expected by
 * `@verdaccio/store`. Token methods are exposed only when the legacy plugin
 * implements them (store already guards their absence with SERVICE_UNAVAILABLE).
 */
export function wrapLegacyStoragePlugin(plugin: any, logger: Logger): any {
  debug('wrapping legacy callback storage plugin');
  logger.warn(
    'a legacy callback-based storage plugin was detected and wrapped for compatibility; ' +
      'consider upgrading it to the promise-based storage API'
  );

  const wrapped: Record<string, AnyFn> = {
    init: () =>
      typeof plugin.init === 'function'
        ? Promise.resolve(plugin.init())
        : Promise.resolve(undefined),
    getSecret: () => Promise.resolve(plugin.getSecret()),
    setSecret: (secret: string) => Promise.resolve(plugin.setSecret(secret)),
    get: () => fromCallback((cb) => plugin.get(cb)),
    add: (name: string) => fromCallback((cb) => plugin.add(name, cb)),
    remove: (name: string) => fromCallback((cb) => plugin.remove(name, cb)),
    search: (query: any) => search(plugin, query),
    getPackageStorage: (packageName: string) =>
      wrapLegacyHandler(plugin.getPackageStorage(packageName)),
  };

  for (const tokenMethod of ['saveToken', 'deleteToken', 'readTokens'] as const) {
    if (typeof plugin[tokenMethod] === 'function') {
      wrapped[tokenMethod] = (...args: any[]) => Promise.resolve(plugin[tokenMethod](...args));
    }
  }

  // preserve any extra plugin surface (e.g. logger, config) by prototype-less merge
  return Object.assign(Object.create(plugin), wrapped);
}
