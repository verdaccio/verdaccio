import buildDebug from 'debug';
import { LRUCache } from 'lru-cache';
import type { Readable } from 'node:stream';

import {
  TarballLimitError,
  type TarballMetadata,
  extractTarballMetadata,
} from '@verdaccio/tarball';
import type { Logger } from '@verdaccio/types';

const debug = buildDebug('verdaccio:storage:tarball-metadata');

const MAX_CONCURRENT_EXTRACTIONS = 2;
const MAX_PENDING_BACKGROUND_JOBS = 100;
const README_CACHE_MAX_BYTES = 50 * 1024 * 1024;
// guards against gzip bombs: unpacked content may be at most this many times the tarball limit
const MAX_UNPACKED_RATIO = 10;
// a stalled read must not hold one of the few extraction slots forever
const EXTRACTION_TIMEOUT_MS = 60 * 1000;

export type TarballSource = (signal: AbortSignal) => Promise<Readable>;

export type TarballMetadataServiceOptions = {
  maxSizeMB: number;
  logger: Logger;
  onMetadata: (name: string, filename: string, metadata: TarballMetadata) => Promise<void>;
};

/**
 * Experimental (`flags.tarballMetadata`): extracts READMEs and size stats from tarballs,
 * in the background or on demand, with bounded concurrency and a size limit.
 */
export class TarballMetadataService {
  private readonly readmes = new LRUCache<string, string>({
    maxSize: README_CACHE_MAX_BYTES,
    sizeCalculation: (readme) => Math.max(readme.length, 1),
  });
  private readonly inFlight = new Map<string, Promise<TarballMetadata | null>>();
  private readonly waiting: (() => void)[] = [];
  private running = 0;
  private pendingBackground = 0;

  public constructor(private readonly options: TarballMetadataServiceOptions) {}

  /** The tarball's root README, from cache or extracted now; undefined when it has none. */
  public async getReadme(
    name: string,
    filename: string,
    source: TarballSource
  ): Promise<string | undefined> {
    const cached = this.readmes.get(cacheKey(name, filename));
    if (cached !== undefined) {
      return cached || undefined;
    }
    const metadata = await this.extract(name, filename, source);
    return metadata?.readme || undefined;
  }

  /** Extract in the background; skipped when already known or too many jobs are pending. */
  public schedule(name: string, filename: string, source: TarballSource): void {
    const key = cacheKey(name, filename);
    if (this.readmes.has(key) || this.inFlight.has(key)) {
      return;
    }
    if (this.pendingBackground >= MAX_PENDING_BACKGROUND_JOBS) {
      debug('background queue full, skipping %o', key);
      return;
    }
    this.pendingBackground++;
    void this.extract(name, filename, source).finally(() => this.pendingBackground--);
  }

  private extract(
    name: string,
    filename: string,
    source: TarballSource
  ): Promise<TarballMetadata | null> {
    const key = cacheKey(name, filename);
    const pending = this.inFlight.get(key);
    if (pending) {
      return pending;
    }
    const task = this.withSlot(() => this.run(key, name, filename, source)).finally(() =>
      this.inFlight.delete(key)
    );
    this.inFlight.set(key, task);
    return task;
  }

  private async run(
    key: string,
    name: string,
    filename: string,
    source: TarballSource
  ): Promise<TarballMetadata | null> {
    const maxTarballSize = this.options.maxSizeMB * 1024 * 1024;
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(EXTRACTION_TIMEOUT_MS)]);
    const startedAt = performance.now();
    const elapsedMs = () => Math.round(performance.now() - startedAt);
    try {
      const stream = await source(signal);
      // skip before unpacking anything when the storage or uplink announces the size
      stream.once('content-length', (size) => {
        if (Number(size) > maxTarballSize) {
          controller.abort(new TarballLimitError(`tarball is larger than ${maxTarballSize} bytes`));
        }
      });
      const metadata = await extractTarballMetadata(stream, {
        maxTarballSize,
        maxUnpackedSize: maxTarballSize * MAX_UNPACKED_RATIO,
        signal,
      });
      this.readmes.set(key, metadata.readme ?? '');
      this.options.logger.info(
        {
          name,
          filename,
          ms: elapsedMs(),
          fileCount: metadata.fileCount,
          unpackedSize: metadata.unpackedSize,
          readme: metadata.readme ? 'yes' : 'no',
        },
        'tarball metadata for @{name} @{filename} in @{ms}ms: @{fileCount} files, @{unpackedSize} bytes, readme @{readme}'
      );
      await this.options.onMetadata(name, filename, metadata).catch((err) => {
        this.options.logger.warn(
          { err, name, filename },
          'saving tarball stats for @{name} @{filename} failed: @{err.message}'
        );
      });
      return metadata;
    } catch (err: any) {
      if (
        err instanceof TarballLimitError ||
        controller.signal.reason instanceof TarballLimitError
      ) {
        this.options.logger.info(
          { name, filename, ms: elapsedMs(), maxSizeMB: this.options.maxSizeMB },
          'tarball @{filename} of @{name} is larger than @{maxSizeMB} MB, not unpacked (@{ms}ms)'
        );
        this.readmes.set(key, '');
        return null;
      }
      this.options.logger.warn(
        { err, name, filename, ms: elapsedMs() },
        'tarball metadata for @{name} @{filename} failed after @{ms}ms: @{err.message}'
      );
      return null;
    }
  }

  private async withSlot<T>(task: () => Promise<T>): Promise<T> {
    while (this.running >= MAX_CONCURRENT_EXTRACTIONS) {
      await new Promise<void>((resolve) => this.waiting.push(resolve));
    }
    this.running++;
    try {
      return await task();
    } finally {
      this.running--;
      this.waiting.shift()?.();
    }
  }
}

function cacheKey(name: string, filename: string): string {
  return `${name}/${filename}`;
}
