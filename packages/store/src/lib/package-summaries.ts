import type { Author, Version } from '@verdaccio/types';

// the list shows a line or two of each field; anything longer from an uplink only costs memory
export const SUMMARY_TEXT_MAX = 500;
export const SUMMARY_KEYWORDS_MAX = 20;

/** The fields of a package's listed version that the web package list renders. */
export type PackageSummary = Pick<Version, 'name' | 'version'> &
  Partial<
    Pick<Version, 'description' | 'keywords' | 'homepage' | 'bugs' | 'author' | 'license'>
  > & {
    time?: string;
    dist?: { tarball: string; unpackedSize?: number };
  };

const clipText = (value: unknown, max = SUMMARY_TEXT_MAX): string | undefined =>
  typeof value === 'string' ? value.slice(0, max) : undefined;

/** A string clipped, or the given keys of an object clipped; anything else is dropped. */
function clipFields<T>(value: unknown, keys: string[]): T | undefined {
  if (typeof value === 'string') {
    return clipText(value) as T;
  }
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  const clipped: Record<string, string | undefined> = {};
  for (const key of keys) {
    clipped[key] = clipText((value as Record<string, unknown>)[key]);
  }
  return clipped as T;
}

const clipKeywords = (value: unknown): string[] | undefined =>
  Array.isArray(value)
    ? value
        .slice(0, SUMMARY_KEYWORDS_MAX)
        .map((keyword) => clipText(keyword))
        .filter((keyword): keyword is string => keyword !== undefined)
    : undefined;

export function toPackageSummary(version: Version & { time?: string }): PackageSummary {
  const { name, description, keywords, homepage, bugs, author, license, time, dist } = version;
  return {
    name,
    version: version.version,
    description: clipText(description),
    keywords: clipKeywords(keywords),
    homepage: clipText(homepage),
    bugs: clipFields<PackageSummary['bugs']>(bugs, ['url', 'email']),
    author: clipFields<Author>(author, ['name', 'email', 'url']),
    license: clipFields<PackageSummary['license']>(license, ['type', 'url']),
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
  private readonly writtenAt = new Map<string, number>();
  private tick = 0;
  private floor = 0;

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

  /** Changes on every write or removal of the entry; see `set`. */
  public generation(name: string): number {
    return this.writtenAt.get(name) ?? this.floor;
  }

  /** Stores the summary; with `generation`, only when nothing wrote the entry since it was read. */
  public set(name: string, summary: PackageSummary, generation?: number): boolean {
    if (generation !== undefined && generation !== this.generation(name)) {
      return false;
    }
    this.markWritten(name);
    this.entries.delete(name);
    this.entries.set(name, { summary, createdAt: Date.now() });
    if (this.entries.size > this.maxEntries) {
      this.entries.delete(this.entries.keys().next().value as string);
    }
    return true;
  }

  public delete(name: string): void {
    this.markWritten(name);
    this.entries.delete(name);
  }

  private markWritten(name: string): void {
    if (this.writtenAt.size >= this.maxEntries && !this.writtenAt.has(name)) {
      // forgotten names answer with the floor, which no generation read before this point matches
      this.floor = this.tick;
      this.writtenAt.clear();
    }
    this.writtenAt.set(name, ++this.tick);
  }

  public get size(): number {
    return this.entries.size;
  }
}

/** Index of the first entry greater than `name` in a sorted list. */
export function indexAfter(sorted: readonly string[], name: string): number {
  let low = 0;
  let high = sorted.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (sorted[middle] <= name) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  return low;
}

/** The sorted list with `name` inserted; the same list when it is already there. */
export function withName(sorted: readonly string[], name: string): readonly string[] {
  const index = indexAfter(sorted, name);
  if (sorted[index - 1] === name) {
    return sorted;
  }
  return [...sorted.slice(0, index), name, ...sorted.slice(index)];
}

/** The sorted list without `name`; the same list when it is not there. */
export function withoutName(sorted: readonly string[], name: string): readonly string[] {
  const index = indexAfter(sorted, name) - 1;
  if (index < 0 || sorted[index] !== name) {
    return sorted;
  }
  return [...sorted.slice(0, index), ...sorted.slice(index + 1)];
}
