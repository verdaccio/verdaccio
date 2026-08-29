import buildDebug from 'debug';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import type { pluginUtils } from '@verdaccio/core';
import { errorUtils } from '@verdaccio/core';
import type { Logger, Manifest } from '@verdaccio/types';

import { STORAGE } from './lib/storage-utils';

const debug = buildDebug('verdaccio:storage:stage');

/**
 * Storage namespace holding every staged item.
 *
 * It is deliberately NOT registered through `storagePlugin.add()`: doing so
 * would list it in the plugin database and leak it into search results and the
 * web UI package list. The staged items are enumerated through {@link STAGE_INDEX}
 * instead.
 */
export const STAGE_NAMESPACE = '.stage';

/**
 * Logical name used when reading/writing the index document. Storage handlers
 * are scoped to a folder and ignore this argument when resolving the path, but
 * it is what shows up in plugin logs, so keep it descriptive.
 */
const STAGE_INDEX = 'stage-index';

/**
 * Metadata of a package version awaiting review.
 *
 * Mirrors the `StagePackageVersion` schema documented by npmjs, plus
 * {@link StageRecord.tarballFilename}, which is internal and must be stripped
 * before serving the record over the API (see {@link toStagePackageVersion}).
 */
export interface StageRecord {
  /** Unique identifier. Must be a UUID: the npm CLI validates the format client side. */
  id: string;
  packageName: string;
  version: string;
  /** dist-tag the version will be published under once approved. */
  tag: string;
  /** ISO timestamp of when the version was staged. */
  createdAt: string;
  /** Username of whoever staged the version. */
  actor: string;
  actorType: 'user';
  access: 'public' | 'private';
  /** sha1 of the tarball, as reported by `npm stage list`. */
  shasum: string;
  /** Internal: name of the tarball inside the staged item folder. */
  tarballFilename: string;
}

/** Shape served to clients: {@link StageRecord} without the internal fields. */
export type StagePackageVersion = Omit<StageRecord, 'tarballFilename'>;

/**
 * The publish payload kept for a staged item, minus `_attachments` (the tarball
 * is stored separately as a real tarball, not as base64 inside this document).
 */
export type StagedPackument = Omit<Manifest, '_attachments'>;

/** Persisted document of a single staged item. */
interface StageDocument {
  record: StageRecord;
  packument: StagedPackument;
}

/** Persisted index of every staged item, newest first. */
interface StageIndex {
  items: StageRecord[];
}

export interface AddStageInput {
  packageName: string;
  version: string;
  tag: string;
  actor: string;
  access: 'public' | 'private';
  shasum: string;
  tarballFilename: string;
  packument: StagedPackument;
}

export interface ListStageFilter {
  /** Restrict the result to a single package name. */
  packageName?: string;
}

/** Strip the internal fields before the record leaves the registry. */
export function toStagePackageVersion(record: StageRecord): StagePackageVersion {
  const { tarballFilename: _tarballFilename, ...rest } = record;
  return rest;
}

function isNotFound(err: any): boolean {
  return err?.code === 'ENOENT' || err?.code === 404 || err?.status === 404;
}

/**
 * Persistence for the staged publish workflow (`npm stage`).
 *
 * Everything goes through {@link pluginUtils.StorageHandler}, so it works with
 * any storage plugin (local-storage, memory, S3, GCS) without the plugin having
 * to know that staging exists. On disk it looks like:
 *
 * ```
 * <storage>/.stage/package.json            index of every staged item
 * <storage>/.stage/<uuid>/package.json     the staged item (record + packument)
 * <storage>/.stage/<uuid>/<name>-<v>.tgz   the staged tarball
 * ```
 */
export class StageStorage {
  private readonly plugin: pluginUtils.Storage<any>;
  private readonly logger: Logger;
  /**
   * Serializes index mutations within this process.
   *
   * `StorageHandler.updatePackage()` takes a lock in local-storage but releases
   * it before we get to save, and other plugins do not lock at all, so a
   * read-modify-write on the index would race. This keeps a single Verdaccio
   * process consistent; several processes sharing one storage backend are NOT
   * supported.
   */
  private indexQueue: Promise<unknown> = Promise.resolve();

  public constructor(plugin: pluginUtils.Storage<any>, logger: Logger) {
    this.plugin = plugin;
    this.logger = logger;
  }

  /** Stage a new version. Returns the persisted record, including its generated id. */
  public async add(
    input: AddStageInput,
    tarball: Buffer,
    { signal }: { signal: AbortSignal }
  ): Promise<StageRecord> {
    const record: StageRecord = {
      id: randomUUID(),
      packageName: input.packageName,
      version: input.version,
      tag: input.tag,
      createdAt: new Date().toISOString(),
      actor: input.actor,
      actorType: 'user',
      access: input.access,
      shasum: input.shasum,
      tarballFilename: input.tarballFilename,
    };
    debug('staging %o@%o as %o', record.packageName, record.version, record.id);

    const handler = this.itemStorage(record.id);
    // the tarball goes first: if it fails there is no record pointing at a
    // tarball that never landed.
    await this.writeTarball(handler, record.tarballFilename, tarball, { signal });
    const document: StageDocument = { record, packument: input.packument };
    await handler.savePackage(record.id, document as unknown as Manifest);
    await this.updateIndex((items) => [record, ...items]);

    this.logger.info(
      { packageName: record.packageName, version: record.version, stageId: record.id },
      'staged @{packageName}@@{version} as @{stageId}'
    );
    return record;
  }

  /** Every staged item, newest first, optionally narrowed to one package. */
  public async list(filter: ListStageFilter = {}): Promise<StageRecord[]> {
    const items = await this.readIndex();
    if (typeof filter.packageName === 'string') {
      return items.filter((item) => item.packageName === filter.packageName);
    }
    return items;
  }

  /** A single staged item, or `undefined` when the id is unknown. */
  public async get(id: string): Promise<StageRecord | undefined> {
    const items = await this.readIndex();
    return items.find((item) => item.id === id);
  }

  /** Whether a version of a package is already staged (used to answer 409). */
  public async findByVersion(
    packageName: string,
    version: string
  ): Promise<StageRecord | undefined> {
    const items = await this.readIndex();
    return items.find((item) => item.packageName === packageName && item.version === version);
  }

  /** The publish payload kept for a staged item, needed to approve it. */
  public async getPackument(id: string): Promise<StagedPackument | undefined> {
    const document = await this.readDocument(id);
    return document?.packument;
  }

  /** Read the staged tarball as a stream. */
  public async readTarball(id: string, { signal }: { signal: AbortSignal }): Promise<Readable> {
    const record = await this.get(id);
    if (!record) {
      throw errorUtils.getNotFound('no such staged package version');
    }
    return this.itemStorage(id).readTarball(record.tarballFilename, { signal });
  }

  /**
   * Drop a staged item and its tarball.
   *
   * @returns `false` when the id was unknown, `true` when something was removed.
   */
  public async remove(id: string): Promise<boolean> {
    const record = await this.get(id);
    if (!record) {
      return false;
    }
    const handler = this.itemStorage(id);
    // the index entry goes first: a leftover folder is invisible, whereas a
    // leftover index entry would surface a staged item that cannot be read.
    await this.updateIndex((items) => items.filter((item) => item.id !== id));
    // the folder can only be dropped once it is empty, so both files go first
    for (const file of [record.tarballFilename, STORAGE.PACKAGE_FILE_NAME]) {
      try {
        await handler.deletePackage(file);
      } catch (err: any) {
        debug('could not delete staged file %o: %s', file, err?.message);
      }
    }
    try {
      await handler.removePackage(id);
    } catch (err: any) {
      debug('could not delete staged folder %o: %s', id, err?.message);
    }
    debug('removed staged item %o', id);
    return true;
  }

  private itemStorage(id: string): pluginUtils.StorageHandler {
    return this.plugin.getPackageStorage(`${STAGE_NAMESPACE}/${id}`);
  }

  private indexStorage(): pluginUtils.StorageHandler {
    return this.plugin.getPackageStorage(STAGE_NAMESPACE);
  }

  private async readDocument(id: string): Promise<StageDocument | undefined> {
    try {
      const document = (await this.itemStorage(id).readPackage(id)) as unknown as StageDocument;
      return document;
    } catch (err: any) {
      if (isNotFound(err)) {
        return undefined;
      }
      throw err;
    }
  }

  private async readIndex(): Promise<StageRecord[]> {
    try {
      const index = (await this.indexStorage().readPackage(STAGE_INDEX)) as unknown as StageIndex;
      return Array.isArray(index?.items) ? index.items : [];
    } catch (err: any) {
      if (isNotFound(err)) {
        debug('no stage index yet');
        return [];
      }
      throw err;
    }
  }

  /** Read-modify-write the index, serialized against other callers (see {@link indexQueue}). */
  private async updateIndex(
    mutate: (items: StageRecord[]) => StageRecord[]
  ): Promise<StageRecord[]> {
    const run = async (): Promise<StageRecord[]> => {
      const items = mutate(await this.readIndex());
      const index: StageIndex = { items };
      await this.indexStorage().savePackage(STAGE_INDEX, index as unknown as Manifest);
      return items;
    };
    const queued = this.indexQueue.then(run, run);
    // keep the chain alive even when a caller rejects
    this.indexQueue = queued.catch(() => undefined);
    return queued;
  }

  private async writeTarball(
    handler: pluginUtils.StorageHandler,
    filename: string,
    tarball: Buffer,
    { signal }: { signal: AbortSignal }
  ): Promise<void> {
    const writeStream = await handler.writeTarball(filename, { signal });

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const fail = (err: Error) => {
        if (!settled) {
          settled = true;
          reject(err);
        }
      };

      writeStream.on('error', fail);
      writeStream.on('close', () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      });
      // both bundled plugins emit 'open' once the underlying descriptor is
      // ready and only then accept writes
      writeStream.on('open', () => {
        pipeline(Readable.from(tarball), writeStream).catch(fail);
      });
    });

    // Both plugins rename the temporary file inside an async 'close' handler
    // that nobody awaits, so 'close' does not guarantee the tarball is in its
    // final place yet. Give the rename a bounded chance to land.
    await this.waitForTarball(handler, filename);
  }

  private async waitForTarball(
    handler: pluginUtils.StorageHandler,
    filename: string,
    attempts = 20
  ): Promise<void> {
    for (let attempt = 0; attempt < attempts; attempt++) {
      if (await handler.hasTarball(filename)) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw errorUtils.getInternalError(`staged tarball ${filename} was never persisted`);
  }
}
