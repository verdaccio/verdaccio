import { STORAGE } from '@verdaccio/store';
import type { DistFiles } from '@verdaccio/types';

export type ProblemType = 'temp-file' | 'orphan-tarball';

export interface FileProblem {
  file: string;
  type: ProblemType;
}

/** Leftover temp files: tarball `<name>.tmp-<n>` and packument `<name>.tmp<n>`. */
export const TEMP_FILE_RE = /\.tmp-?\d+$/;

/**
 * Given a package folder listing and the tarball names its manifest references,
 * return the safely removable problems: leftover temp files and `.tgz` tarballs
 * that no version points at.
 */
export function findFileProblems(files: string[], referencedTarballs: string[]): FileProblem[] {
  const referenced = new Set(referencedTarballs);
  const problems: FileProblem[] = [];
  for (const file of files) {
    if (file === STORAGE.PACKAGE_FILE_NAME) {
      continue;
    }
    if (TEMP_FILE_RE.test(file)) {
      problems.push({ file, type: 'temp-file' });
    } else if (file.endsWith('.tgz') && !referenced.has(file)) {
      problems.push({ file, type: 'orphan-tarball' });
    }
  }
  return problems;
}

/** Referenced tarballs that are not present on disk (broken package, report only). */
export function findMissingTarballs(files: string[], referencedTarballs: string[]): string[] {
  const present = new Set(files);
  return referencedTarballs.filter((name) => !present.has(name));
}

/** Hosts of the configured uplinks, used to validate distfile bookkeeping. */
export function getUplinkHosts(uplinks: Record<string, { url?: string }> | undefined): Set<string> {
  const hosts = new Set<string>();
  for (const uplink of Object.values(uplinks ?? {})) {
    if (uplink?.url) {
      try {
        hosts.add(new URL(uplink.url).host);
      } catch {
        // ignore an unparseable uplink url
      }
    }
  }
  return hosts;
}

export interface StaleDistfile {
  file: string;
  /** the offending host, or `(no url)` when the entry has no/invalid url */
  host: string;
}

/**
 * `_distfiles` entries whose url points to a host that is not a configured uplink
 * (stale bookkeeping from a removed/renamed uplink or a migrated CDN). The self-heal
 * fallback would fetch off-uplink from them, so they are worth flagging (report only).
 */
export function findStaleDistfiles(
  distfiles: DistFiles | undefined,
  uplinkHosts: Set<string>
): StaleDistfile[] {
  const stale: StaleDistfile[] = [];
  for (const [file, entry] of Object.entries(distfiles ?? {})) {
    let host: string | undefined;
    try {
      host = entry?.url ? new URL(entry.url).host : undefined;
    } catch {
      host = undefined;
    }
    if (!host || !uplinkHosts.has(host)) {
      stale.push({ file, host: host ?? '(no url)' });
    }
  }
  return stale;
}
