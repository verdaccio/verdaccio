import type { Version } from '@verdaccio/types';

/** The fields of a package's listed version that the web package list renders. */
export type PackageSummary = Pick<
  Version,
  'name' | 'version' | 'description' | 'keywords' | 'homepage' | 'bugs' | 'author' | 'license'
> & {
  time?: string;
  dist?: { tarball: string; unpackedSize?: number };
};

export function toPackageSummary(version: Version & { time?: string }): PackageSummary {
  const { name, description, keywords, homepage, bugs, author, license, time, dist } = version;
  return {
    name,
    version: version.version,
    description,
    keywords,
    homepage,
    bugs,
    author,
    license,
    time,
    dist: dist ? { tarball: dist.tarball, unpackedSize: dist.unpackedSize } : undefined,
  };
}

/**
 * Bounded, least-recently-used map of package summaries with a time to live.
 * The time to live only covers writes this process does not see (another instance on the same storage).
 */
export class PackageSummaryCache {
  private readonly entries = new Map<string, { summary: PackageSummary; createdAt: number }>();

  public constructor(
    private readonly maxEntries: number,
    private readonly ttlMs: number
  ) {}

  public get(name: string): PackageSummary | undefined {
    const entry = this.entries.get(name);
    if (!entry) {
      return undefined;
    }
    this.entries.delete(name);
    if (Date.now() - entry.createdAt >= this.ttlMs) {
      return undefined;
    }
    this.entries.set(name, entry);
    return entry.summary;
  }

  public set(name: string, summary: PackageSummary): void {
    this.entries.delete(name);
    this.entries.set(name, { summary, createdAt: Date.now() });
    if (this.entries.size > this.maxEntries) {
      this.entries.delete(this.entries.keys().next().value as string);
    }
  }

  public delete(name: string): void {
    this.entries.delete(name);
  }

  public get size(): number {
    return this.entries.size;
  }
}
