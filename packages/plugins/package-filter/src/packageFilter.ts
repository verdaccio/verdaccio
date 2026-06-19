import buildDebug from 'debug';

import { pluginUtils } from '@verdaccio/core';
import type { Logger, Manifest } from '@verdaccio/types';

import { parseConfig } from './config/parser';
import type { ParsedConfig, PluginConfig } from './config/types';
import { filterBlockedVersions } from './filtering/packageVersion';
import { filterVersionsByPublishDate } from './filtering/publishDate';
import { jsonLogReplacer } from './utils/jsonUtils';
import {
  cleanupDistFiles,
  cleanupTags,
  cleanupTime,
  getManifestClone,
  setupCreatedAndModified,
  setupLatestTag,
} from './utils/manifestUtils';

const debug = buildDebug('verdaccio:plugin:package-filter');

export class PackageFilterPlugin
  extends pluginUtils.Plugin<PluginConfig>
  implements pluginUtils.ManifestFilter<PluginConfig>
{
  public readonly config: PluginConfig;
  private readonly parsedConfig: ParsedConfig;
  protected readonly logger: Logger;

  public constructor(config: PluginConfig, options: pluginUtils.PluginOptions) {
    super(config, options);
    this.config = config ?? {};
    this.logger = options.logger;
    this.parsedConfig = parseConfig(this.config);

    debug(
      'plugin loaded: block rules: %d, allow rules: %d',
      this.parsedConfig.blockRules.size,
      this.parsedConfig.allowRules.size
    );
    this.logger.debug(
      { config: JSON.stringify(this.parsedConfig, jsonLogReplacer) },
      'package-filter loaded with config: @{config}'
    );
    this.logger.trace(
      {
        blockRules: this.parsedConfig.blockRules.size,
        allowRules: this.parsedConfig.allowRules.size,
      },
      'package-filter plugin initialized: @{blockRules} block rules, @{allowRules} allow rules'
    );
    if (this.parsedConfig.dateThreshold) {
      debug('date threshold: %s', this.parsedConfig.dateThreshold.toISOString());
      this.logger.trace(
        { dateThreshold: this.parsedConfig.dateThreshold.toISOString() },
        'package-filter date threshold: @{dateThreshold}'
      );
    }
    if (this.parsedConfig.minAgeMs) {
      const minAgeDays = this.parsedConfig.minAgeMs / (24 * 60 * 60 * 1000);
      debug('min age: %d days', minAgeDays);
      this.logger.trace({ minAgeDays }, 'package-filter min age: @{minAgeDays} days');
    }
  }

  public async filter_metadata(manifest: Readonly<Manifest>): Promise<Manifest> {
    const { dateThreshold, minAgeMs, blockRules, allowRules } = this.parsedConfig;
    const versionCount = Object.keys(manifest.versions ?? {}).length;
    debug('filtering manifest for %s (%d versions)', manifest.name, versionCount);
    this.logger.trace(
      { name: manifest.name, versionCount },
      'package-filter processing @{name} (@{versionCount} versions)'
    );

    let earliestDateThreshold: Date | null = null;
    if (minAgeMs) {
      earliestDateThreshold = new Date(Date.now() - minAgeMs);
    }

    if (dateThreshold && (!earliestDateThreshold || dateThreshold < earliestDateThreshold)) {
      earliestDateThreshold = dateThreshold;
    }

    // Fast path: when neither block rules nor a date threshold are configured there
    // is nothing this filter can change. Returning the manifest untouched avoids the
    // clone and the cleanup passes below. This matters most for `npm search`, which
    // invokes filter_metadata once per matched package (see issue #5837).
    if (blockRules.size === 0 && !earliestDateThreshold) {
      debug('no filters configured, returning manifest untouched for %s', manifest.name);
      return manifest as Manifest;
    }

    let newManifest = getManifestClone(manifest);
    if (blockRules.size > 0) {
      newManifest = filterBlockedVersions(newManifest, blockRules, allowRules, this.logger);
    }

    if (earliestDateThreshold) {
      debug(
        'applying date filter for %s, threshold: %s',
        manifest.name,
        earliestDateThreshold.toISOString()
      );
      this.logger.trace(
        { name: manifest.name, threshold: earliestDateThreshold.toISOString() },
        'applying date filter for @{name}, cutoff: @{threshold}'
      );
      newManifest = filterVersionsByPublishDate(newManifest, earliestDateThreshold, allowRules);
    }

    const filteredCount = Object.keys(newManifest.versions).length;
    const removedCount = versionCount - filteredCount;
    // The cleanup passes only repair inconsistencies introduced by filtering:
    // orphaned dist-tags/time/_distfiles entries and a `latest` tag pointing at a
    // removed version. When the filters left the manifest untouched (no version
    // removed or replaced) it is already consistent, so the passes are skipped.
    // `readme` changing is the signal that the (count-preserving) replace strategy
    // rewrote version content and the cleanup still needs to run.
    const wasModified = removedCount > 0 || newManifest.readme !== manifest.readme;
    if (wasModified) {
      cleanupTags(newManifest);
      setupLatestTag(newManifest);
      cleanupTime(newManifest);
      setupCreatedAndModified(newManifest);
      cleanupDistFiles(newManifest);
    }

    if (removedCount > 0) {
      debug(
        'filtered %s: %d -> %d versions (%d removed)',
        manifest.name,
        versionCount,
        filteredCount,
        removedCount
      );
      this.logger.trace(
        { name: manifest.name, before: versionCount, after: filteredCount, removed: removedCount },
        'package-filter @{name}: @{before} -> @{after} versions (@{removed} removed)'
      );
    } else {
      debug('no versions filtered for %s', manifest.name);
    }

    return newManifest;
  }
}
