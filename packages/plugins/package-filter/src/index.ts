import semver from 'semver';

import { pluginUtils } from '@verdaccio/core';
import { Logger, Manifest } from '@verdaccio/types';

import { parseConfig } from './config/parser';
import { ParsedConfig, PluginConfig } from './config/types';
import { filterBlockedVersions } from './filtering/packageVersion';
import { filterVersionsByPublishDate } from './filtering/publishDate';

/**
 * Delete tags corresponding to removed versions
 */
function cleanupTags(manifest: Manifest): void {
  const distTags = manifest['dist-tags'];
  Object.entries(distTags).forEach(([tag, tagVersion]) => {
    if (!manifest.versions[tagVersion]) {
      delete distTags[tag];
    }
  });
}

/**
 * Delete time entries corresponding to removed versions
 */
function cleanupTime(packageInfo: Manifest): void {
  const time = packageInfo.time;
  if (!time) {
    return;
  }

  Object.keys(time).forEach((version) => {
    if (!packageInfo.versions[version]) {
      delete time[version];
    }
  });
}

function getLatestVersion(packageInfo: Manifest, versions: string[]): string | undefined {
  const time = packageInfo.time;
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
 * Set the latest tag if dist-tags/latest is missing
 */
function setupLatestTag(packageInfo: Manifest): void {
  const distTags = packageInfo['dist-tags'];
  if (distTags.latest) {
    // Tag 'latest' must only be fixed when latest version was blocked
    return;
  }

  const versions = Object.keys(packageInfo.versions);
  if (versions.length === 0) {
    return;
  }

  const untaggedVersions = versions.filter(
    (v) => semver.valid(v) && Object.values(distTags).indexOf(v) === -1
  );
  if (untaggedVersions.length === 0) {
    return;
  }

  // Try stable versions first (no "-next" or "-beta", etc.)
  const stableVersions = untaggedVersions.filter((v) => !semver.prerelease(v));
  const latestStableVersion = getLatestVersion(packageInfo, stableVersions);
  if (latestStableVersion) {
    distTags.latest = latestStableVersion;
    return;
  }

  // Fallback to all versions
  const latestVersion = getLatestVersion(packageInfo, untaggedVersions);
  if (!latestVersion) {
    return;
  }

  distTags.latest = latestVersion;
}

/**
 * Set the created and modified times
 */
function setupCreatedAndModified(packageInfo: Manifest): void {
  const time = packageInfo.time;
  if (!time) {
    return;
  }

  const times = Object.values(time);
  if (times.length === 0) {
    return;
  }

  const sortedTimes = times.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  time['created'] = sortedTimes[0];
  time['modified'] = sortedTimes[sortedTimes.length - 1];
}

/**
 * Remove distfiles that are not used by any version
 */
function cleanupDistFiles(manifest: Manifest): void {
  const distFiles = manifest._distfiles;
  Object.entries(distFiles).forEach(([key, file]) => {
    const fileUrl = file.url;
    const versionPointingToFile = Object.values(manifest.versions).find(
      (v) => v.dist.tarball === fileUrl
    );
    if (!versionPointingToFile) {
      delete distFiles[key];
    }
  });
}

function getManifestClone(packageInfo: Readonly<Manifest>): Manifest {
  return {
    ...packageInfo,
    name: packageInfo.name ?? '',
    versions: {
      ...packageInfo.versions,
    },
    'dist-tags': {
      ...packageInfo['dist-tags'],
    },
    time: {
      ...packageInfo.time,
    },
    _distfiles: {
      ...packageInfo._distfiles,
    },
  };
}

export default class PackageFilterPlugin
  extends pluginUtils.Plugin<PluginConfig>
  implements pluginUtils.ManifestFilter<PluginConfig>
{
  public readonly config: PluginConfig;
  private readonly parsedConfig: ParsedConfig;
  protected readonly logger: Logger;

  public constructor(config: PluginConfig, options: pluginUtils.PluginOptions) {
    super(config, options);
    this.config = config;
    this.logger = options.logger;
    this.parsedConfig = parseConfig(config);

    options.logger.debug(
      `Loaded plugin-delay-filter, ${JSON.stringify(this.parsedConfig, null, 4)}`
    );
  }

  public async filter_metadata(packageInfo: Readonly<Manifest>): Promise<Manifest> {
    const { dateThreshold, minAgeMs, blockRules, allowRules } = this.parsedConfig;

    let newManifest = getManifestClone(packageInfo);
    if (blockRules.size > 0) {
      newManifest = filterBlockedVersions(newManifest, blockRules, allowRules, this.logger);
    }

    let earliestDateThreshold: Date | null = null;
    if (minAgeMs) {
      earliestDateThreshold = new Date(Date.now() - minAgeMs);
    }

    if (dateThreshold && (!earliestDateThreshold || dateThreshold < earliestDateThreshold)) {
      earliestDateThreshold = dateThreshold;
    }

    if (earliestDateThreshold) {
      newManifest = filterVersionsByPublishDate(newManifest, earliestDateThreshold, allowRules);
    }

    cleanupTags(newManifest);
    setupLatestTag(newManifest);
    cleanupTime(newManifest);
    setupCreatedAndModified(newManifest);
    cleanupDistFiles(newManifest);
    return Promise.resolve(newManifest);
  }
}
