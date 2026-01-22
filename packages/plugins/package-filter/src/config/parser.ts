import { Range } from 'semver';

import { ConfigRule, ParsedConfig, ParsedRule, PluginConfig } from './types';

function parseConfigRules(configRules: ConfigRule[]): Map<string, ParsedRule> {
  const ruleMap = new Map<string, ParsedRule>();
  for (const rule of configRules) {
    if ('scope' in rule && typeof rule.scope === 'string') {
      if (!rule.scope.startsWith('@')) {
        throw new TypeError(`Scope value must start with @, found: ${rule.scope}`);
      }

      ruleMap.set(rule.scope, 'scope');
      continue;
    }

    if ('package' in rule && !('versions' in rule)) {
      ruleMap.set(rule.package, 'package');
      continue;
    }

    if ('package' in rule && 'versions' in rule) {
      const previousConfig = ruleMap.get(rule.package) || { versions: [] };

      if (typeof previousConfig === 'string') {
        throw new Error(
          `Package ${rule.package} is already specified by another strict rule ${previousConfig}`
        );
      }

      // Merge version ranges of the rules for the same package
      const range = new Range(rule.versions);
      ruleMap.set(rule.package, {
        versions: [...previousConfig.versions, range],
        strategy: rule.strategy ?? 'block',
      });

      continue;
    }

    throw new TypeError(`Could not parse rule ${JSON.stringify(rule, null, 4)}`);
  }

  return ruleMap;
}

export function parseConfig(config: PluginConfig): ParsedConfig {
  const blockMap = parseConfigRules(config.block ?? []);
  const allowMap = parseConfigRules(config.allow ?? []);
  const dateThreshold = config.dateThreshold ? new Date(config.dateThreshold) : null;
  if (dateThreshold && isNaN(dateThreshold.getTime())) {
    throw new TypeError(`Invalid date ${config.dateThreshold} was provided for dateThreshold`);
  }

  const minAgeDays = config.minAgeDays ? Number(config.minAgeDays) : null;
  let minAgeMs: number | null = null;
  if (minAgeDays !== null) {
    if (isNaN(minAgeDays) || minAgeDays < 0) {
      throw new TypeError(`Invalid number ${config.minAgeDays} was provided for minAgeDays`);
    }

    minAgeMs = minAgeDays * 24 * 60 * 60 * 1000;
  }

  return {
    ...config,
    dateThreshold,
    minAgeMs,
    blockRules: blockMap,
    allowRules: allowMap,
  };
}
