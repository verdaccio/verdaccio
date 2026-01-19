import { Range } from 'semver';

import { Config } from '@verdaccio/types';

export type BlockStrategy = 'block' | 'replace';

export type ConfigRule =
  | { scope: string }
  | { package: string }
  | { package: string; versions: string; strategy?: BlockStrategy };

export interface CustomConfig extends Config {
  dateThreshold?: string | number;
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
