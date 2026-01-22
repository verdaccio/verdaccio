import { pluginUtils } from '@verdaccio/core';
import { Logger, Manifest } from '@verdaccio/types';

import { parseConfig } from './config/parser';
import { ParsedConfig, PluginConfig } from './config/types';
import { filterBlockedVersions } from './filtering/packageVersion';
import { filterVersionsByPublishDate } from './filtering/publishDate';
import {
  cleanupDistFiles,
  cleanupTags,
  cleanupTime,
  getManifestClone,
  setupCreatedAndModified,
  setupLatestTag,
} from './manifestUtils';

export class PackageFilterPlugin
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

  public async filter_metadata(manifest: Readonly<Manifest>): Promise<Manifest> {
    const { dateThreshold, minAgeMs, blockRules, allowRules } = this.parsedConfig;

    let newManifest = getManifestClone(manifest);
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
