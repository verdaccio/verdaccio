/**
 * A storage plugin written against the pre-8 callback contract, so the e2e battery
 * drives src/lib/legacy-storage-adapter.ts instead of the promise path.
 *
 * Shaped like the third-party plugins the adapter exists for: a default-exported class
 * with callback methods and stream-returning tarball handlers, extending nothing.
 *
 * The persistence is delegated to @verdaccio/local-storage on purpose. What is under
 * test is the adapter, so a bug here would be indistinguishable from a bug there.
 */
const { PassThrough, Readable } = require('node:stream');

const LocalStorageModule = require('@verdaccio/local-storage');

const LocalStorage = LocalStorageModule.default || LocalStorageModule;

/** Settle a promise through an error-first callback. */
function toCallback(promise, cb) {
  promise.then((data) => cb(null, data)).catch((err) => cb(err));
}

class LegacyPackageStorage {
  constructor(handler, packageName, tarballs) {
    this.handler = handler;
    this.name = packageName;
    this.tarballs = tarballs;
  }

  readPackage(name, cb) {
    toCallback(this.handler.readPackage(name), cb);
  }

  createPackage(name, manifest, cb) {
    toCallback(this.handler.createPackage(name, manifest), cb);
  }

  savePackage(name, value, cb) {
    toCallback(this.handler.savePackage(name, value), cb);
  }

  deletePackage(fileName, cb) {
    // tarballs live in this.tarballs, so only the manifest reaches the real handler
    const key = `${this.name}/${fileName}`;
    if (this.tarballs.delete(key)) {
      process.nextTick(() => cb(null));
      return;
    }
    toCallback(this.handler.deletePackage(fileName), cb);
  }

  removePackage(cb) {
    for (const key of this.tarballs.keys()) {
      if (key.startsWith(`${this.name}/`)) {
        this.tarballs.delete(key);
      }
    }
    this.handler
      .removePackage()
      .then(() => cb(null))
      .catch((err) => cb(err?.code === 'ENOENT' ? null : err));
  }

  /**
   * Tarballs are kept in memory rather than delegated: the modern handler returns a
   * promise of a stream, while the legacy contract has to hand one back synchronously,
   * and bridging that would mean writing a second adapter inside the fixture.
   */
  readTarball(fileName) {
    const key = `${this.name}/${fileName}`;
    const stream = new PassThrough();
    stream.abort = () => stream.destroy();

    // setImmediate, not nextTick: the store awaits the stream, and nextTick runs before
    // that promise continuation, so the consumer would miss `open` and hang
    setImmediate(() => {
      const data = this.tarballs.get(key);
      if (!data) {
        stream.emit('error', Object.assign(new Error('no such file available'), { code: 404 }));
        return;
      }
      stream.emit('content-length', data.length);
      stream.emit('open');
      Readable.from([data]).pipe(stream);
    });

    return stream;
  }

  writeTarball(fileName) {
    const key = `${this.name}/${fileName}`;
    const chunks = [];
    const stream = new PassThrough();
    let aborted = false;
    let drained = false;
    let doneCalled = false;
    let committed = false;

    // the adapter calls end() then done(); commit only once the bytes have drained too
    const commit = () => {
      if (aborted || committed || !drained || !doneCalled) {
        return;
      }
      committed = true;
      this.tarballs.set(key, Buffer.concat(chunks));
      stream.emit('success');
    };

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => {
      drained = true;
      commit();
    });
    stream.abort = () => {
      aborted = true;
      this.tarballs.delete(key);
      stream.destroy();
    };
    stream.done = () => {
      doneCalled = true;
      commit();
    };

    setImmediate(() => stream.emit('open'));
    return stream;
  }

  /** The four-callback legacy shape the adapter bridges to a single updateHandler. */
  updatePackage(name, updateHandler, onWrite, transformPackage, onEnd) {
    this.handler
      .updatePackage(name, async (manifest) => {
        await new Promise((resolve, reject) => {
          updateHandler(manifest, (err) => (err ? reject(err) : resolve()));
        });
        return transformPackage(manifest);
      })
      .then((updated) => onWrite(name, updated, (err) => onEnd(err ?? null)))
      .catch((err) => onEnd(err));
  }
}

class LegacyStorage {
  constructor(pluginConfig, options) {
    // the loader hands plugins (pluginConfig, {config, logger}); @verdaccio/local-storage
    // itself takes (appConfig, logger)
    this.modern = new LocalStorage(options.config, options.logger);
    this.logger = options.logger;
    this.tarballs = new Map();
  }

  init() {
    return this.modern.init();
  }

  getSecret() {
    return this.modern.getSecret();
  }

  setSecret(secret) {
    return this.modern.setSecret(secret);
  }

  get(cb) {
    toCallback(this.modern.get(), cb);
  }

  add(name, cb) {
    toCallback(this.modern.add(name), cb);
  }

  remove(name, cb) {
    toCallback(this.modern.remove(name), cb);
  }

  /**
   * The legacy streaming contract: emit the package itself rather than a search item,
   * and ask the caller which names are eligible. Both are what the adapter normalises.
   */
  search(onPackage, onEnd, validateName) {
    this.modern
      .search({})
      .then(async (items) => {
        for (const item of items) {
          const name = item?.package?.name ?? item?.name;
          if (typeof name === 'string' && validateName(name)) {
            await new Promise((resolve) => {
              onPackage({ name, path: name, time: Date.now() }, resolve);
            });
          }
        }
        onEnd();
      })
      .catch((err) => onEnd(err));
  }

  getPackageStorage(packageName) {
    return new LegacyPackageStorage(
      this.modern.getPackageStorage(packageName),
      packageName,
      this.tarballs
    );
  }

  saveToken(token) {
    return this.modern.saveToken(token);
  }

  deleteToken(user, tokenKey) {
    return this.modern.deleteToken(user, tokenKey);
  }

  readTokens(filter) {
    return this.modern.readTokens(filter);
  }
}

module.exports = { default: LegacyStorage };
