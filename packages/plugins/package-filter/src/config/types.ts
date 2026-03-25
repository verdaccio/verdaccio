import type { Range } from 'semver';

export type BlockStrategy = 'block' | 'replace';

export type ConfigRule =
  | { scope: string }
  | { package: string }
  | { package: string; versions: string; strategy?: BlockStrategy };

export interface PluginConfig {
  /**
   * An absolute date cutoff (e.g. '2023-01-01'). Versions published after this
   * date will be blocked. When both `dateThreshold` and `minAgeDays` are set,
   * the earlier (more restrictive) date wins.
   */
  dateThreshold?: string | number;
  /**
   * A relative age cutoff in days. Versions published less than this many days
   * ago will be blocked. When both `minAgeDays` and `dateThreshold` are set,
   * the earlier (more restrictive) date wins.
   */
  minAgeDays?: number;
  block?: ConfigRule[];
  allow?: ConfigRule[];
}

export interface ParsedConfigRule {
  versions: Range[];
  strategy?: BlockStrategy;
}

export type PackageScopeLevel = 'scope' | 'package' | undefined;
export type ParsedRule = ParsedConfigRule | PackageScopeLevel;

export interface ParsedConfig {
  dateThreshold: Date | null;
  minAgeMs: number | null;
  blockRules: Map<string, ParsedRule>;
  allowRules: Map<string, ParsedRule>;
}
