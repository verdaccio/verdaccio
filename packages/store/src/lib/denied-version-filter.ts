import _ from 'lodash';

import { DIST_TAGS, authUtils } from '@verdaccio/core';
import { Config, Manifest, Version } from '@verdaccio/types';

import { sortVersionsAndFilterInvalid } from './versions-utils';

export class DeniedVersionFilter {
  private cache: Map<string, Set<string>> = new Map();

  public constructor(private config: Config) {}

  public filterManifest(pkgName: string, manifest: Manifest): Manifest {
    const deniedVersions = this.getDeniedVersions(pkgName);
    if (deniedVersions.size === 0) {
      return manifest;
    }

    const deniedSet = new Set(deniedVersions);
    const shouldFilter =
      this.hasDeniedVersions(manifest, deniedSet) || this.hasDeniedDistTags(manifest, deniedSet);

    if (!shouldFilter) {
      return manifest;
    }

    const clonedManifest: Manifest = {
      ...manifest,
      versions: { ...manifest.versions },
      time: { ...(manifest.time || {}) },
      [DIST_TAGS]: { ...(manifest[DIST_TAGS] || {}) },
    };

    if (manifest._attachments) {
      clonedManifest._attachments = { ...manifest._attachments };
    }

    this.removeDeniedVersions(clonedManifest, deniedSet);
    this.normalizeDistTags(clonedManifest, deniedSet);
    clonedManifest.time = {
      ...(clonedManifest.time || {}),
      modified: new Date().toISOString(),
    };

    return clonedManifest;
  }

  public isVersionDenied(pkgName: string, version?: string | void): boolean {
    if (!version) {
      return false;
    }
    return this.getDeniedVersions(pkgName).has(version);
  }

  private getDeniedVersions(pkgName: string): Set<string> {
    if (this.cache.has(pkgName)) {
      return this.cache.get(pkgName)!;
    }

    const matchedSpec = authUtils.getMatchedPackagesSpec(pkgName, this.config.packages);
    const denied = matchedSpec?.deniedVersions ?? [];
    const normalized = new Set(
      denied.filter((version) => {
        return _.isString(version) && version.length > 0;
      })
    );
    this.cache.set(pkgName, normalized);
    return normalized;
  }

  private hasDeniedVersions(manifest: Manifest, deniedSet: Set<string>): boolean {
    for (const version in manifest.versions) {
      if (deniedSet.has(version)) {
        return true;
      }
    }
    return false;
  }

  private hasDeniedDistTags(manifest: Manifest, deniedSet: Set<string>): boolean {
    const distTags = manifest[DIST_TAGS];
    if (!distTags) {
      return false;
    }

    return Object.values(distTags).some((version) => {
      return typeof version === 'string' && deniedSet.has(version);
    });
  }

  private removeDeniedVersions(manifest: Manifest, deniedSet: Set<string>): void {
    // remove versions and related metadata
    for (const version in manifest.versions) {
      if (!Object.prototype.hasOwnProperty.call(manifest.versions, version)) {
        continue;
      }
      if (deniedSet.has(version)) {
        delete manifest.versions[version];
        if (manifest.time && version in manifest.time) {
          delete manifest.time[version];
        }
      }
    }

    if (manifest._attachments) {
      for (const attachmentName in manifest._attachments) {
        if (!Object.prototype.hasOwnProperty.call(manifest._attachments, attachmentName)) {
          continue;
        }
        const attachment = manifest._attachments[attachmentName];
        if (attachment?.version && deniedSet.has(attachment.version)) {
          delete manifest._attachments[attachmentName];
        }
      }
    }
  }

  private normalizeDistTags(manifest: Manifest, deniedSet: Set<string>): void {
    const distTags = manifest[DIST_TAGS] || {};
    const fallbackVersion = this.resolveFallbackVersion(manifest.versions);
    for (const tag in distTags) {
      if (!Object.prototype.hasOwnProperty.call(distTags, tag)) {
        continue;
      }
      const version = distTags[tag];
      const isDenied = typeof version === 'string' && deniedSet.has(version);
      const hasVersion = typeof version === 'string' && manifest.versions[version];
      if (isDenied || !hasVersion) {
        if (tag === 'latest' && fallbackVersion) {
          distTags[tag] = fallbackVersion;
        } else {
          delete distTags[tag];
        }
      }
    }
    manifest[DIST_TAGS] = distTags;
  }

  private resolveFallbackVersion(versions: Record<string, Version>): string | undefined {
    const availableVersions = Object.keys(versions);
    if (availableVersions.length === 0) {
      return;
    }

    const sorted = sortVersionsAndFilterInvalid(availableVersions);
    return sorted[sorted.length - 1];
  }
}
