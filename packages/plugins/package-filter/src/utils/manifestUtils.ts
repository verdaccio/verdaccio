import semver from 'semver';

import { DIST_TAGS } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

/**
 * Delete `dist-tags` entries corresponding to missing versions.
 */
export function cleanupTags(manifest: Manifest): void {
  const distTags = manifest[DIST_TAGS];
  Object.entries(distTags).forEach(([tag, tagVersion]) => {
    if (!manifest.versions[tagVersion]) {
      delete distTags[tag];
    }
  });
}

/**
 * Delete `time` entries corresponding to missing versions.
 */
export function cleanupTime(manifest: Manifest): void {
  const time = manifest.time;
  if (!time) {
    return;
  }

  Object.keys(time).forEach((version) => {
    if (!manifest.versions[version]) {
      delete time[version];
    }
  });
}

/**
 * Get the latest version from a list of versions,
 * ordered by time of their publication stored in the manifest.
 */
export function getLatestVersion(manifest: Manifest, versions: string[]): string | undefined {
  const time = manifest.time;
  if (!time) {
    // No time information, it's the best we can do
    const sortedVersions = versions.sort(semver.rcompare);
    return sortedVersions[0];
  }

  const timedVersions = versions
    .map((v) => ({
      version: v,
      time: time[v],
    }))
    .filter((v) => v.time);

  if (timedVersions.length === 0) {
    return undefined;
  }

  const timeOrderedVersions = timedVersions.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
  return timeOrderedVersions[0].version;
}

/**
 * Set the latest tag if dist-tags/latest is missing.
 * The last stable version available is used when possible.
 * Otherwise, it uses the latest version not found in dist-tags.
 */
export function setupLatestTag(manifest: Manifest): void {
  const distTags = manifest[DIST_TAGS];
  if (distTags.latest) {
    // Tag 'latest' must only be fixed when latest version was blocked
    return;
  }

  const versions = Object.keys(manifest.versions);
  if (versions.length === 0) {
    return;
  }

  const distTagsVersions = Object.values(distTags);
  const untaggedVersions = versions.filter((v) => semver.valid(v) && !distTagsVersions.includes(v));
  if (untaggedVersions.length === 0) {
    return;
  }

  // Try stable versions first (no "-next" or "-beta", etc.)
  const stableVersions = untaggedVersions.filter((v) => !semver.prerelease(v));
  const latestStableVersion = getLatestVersion(manifest, stableVersions);
  if (latestStableVersion) {
    distTags.latest = latestStableVersion;
    return;
  }

  // Fallback to all untagged versions
  const latestVersion = getLatestVersion(manifest, untaggedVersions);
  if (!latestVersion) {
    return;
  }

  distTags.latest = latestVersion;
}

/**
 * Set the created and modified times.
 */
export function setupCreatedAndModified(manifest: Manifest): void {
  const time = manifest.time;
  if (!time) {
    return;
  }

  const times = Object.values(time);
  if (times.length === 0) {
    return;
  }

  const sortedTimes = times.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  time.created = sortedTimes[0];
  time.modified = sortedTimes[sortedTimes.length - 1];
}

/**
 * Remove `_distfiles` entries which are not used by any version.
 */
export function cleanupDistFiles(manifest: Manifest): void {
  const distFiles = manifest._distfiles;
  Object.entries(distFiles).forEach(([key, file]) => {
    const fileUrl = file.url;
    const versionPointingToFile = Object.values(manifest.versions).find(
      (v) => v.dist?.tarball === fileUrl
    );

    if (!versionPointingToFile) {
      delete distFiles[key];
    }
  });
}

/**
 * Creates a copy of a manifest suitable for safe, localized mutation.
 *
 * The returned object is shallow-cloned, except for `versions`, `dist-tags`,
 * `time`, and `_distfiles`, which are cloned as independent maps so they can be
 * filtered or modified without affecting the original manifest.
 */
export function getManifestClone(manifest: Readonly<Manifest>): Manifest {
  return {
    ...manifest,
    versions: {
      ...manifest.versions,
    },
    [DIST_TAGS]: {
      ...manifest[DIST_TAGS],
    },
    time: {
      ...manifest.time,
    },
    _distfiles: {
      ...manifest._distfiles,
    },
  };
}
