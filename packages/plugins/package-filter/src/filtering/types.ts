import { PackageScopeLevel, ParsedConfigRule } from '../config/types';

export enum MatchType {
  SCOPE = 'scope',
  PACKAGE = 'package',
  VERSIONS = 'versions',
}

export interface MatchResultVersions {
  versions: string[];
}

export interface MatchScopeResult extends MatchResultVersions {
  type: MatchType.SCOPE;
  rule: PackageScopeLevel;
  scope: string;
}

export interface MatchPackageResult extends MatchResultVersions {
  type: MatchType.PACKAGE;
  rule: PackageScopeLevel;
  package: string;
}

export interface MatchVersionsResult extends MatchResultVersions {
  type: MatchType.VERSIONS;
  rule: ParsedConfigRule;
}

export type MatchResult = MatchScopeResult | MatchPackageResult | MatchVersionsResult;
