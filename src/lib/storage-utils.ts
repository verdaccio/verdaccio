import createDebug from 'debug';
import _ from 'lodash';

import { pkgUtils } from '@verdaccio/core';
import { SearchMemoryIndexer } from '@verdaccio/search-indexer';
import {
  AbbreviatedManifest,
  AbbreviatedVersions,
  DistFile,
  Manifest,
  Version,
} from '@verdaccio/types';
import { generateRandomHexString } from '@verdaccio/utils';

import { API_ERROR, DIST_TAGS, HTTP_STATUS, STORAGE, USERS } from './constants';
import LocalStorage from './local-storage';
import { logger } from './logger';
import { ErrorCode, isObject, normalizeDistTags } from './utils';

const debug = createDebug('verdaccio:storage-utils');

/**
 * Create an empty package manifest with all the internal bookkeeping
 * sections (`_uplinks`, `_distfiles`, `_attachments`, `_rev`) initialized.
 * Used as the starting point when a package is seen for the first time.
 * @param name package name
 * @return an empty manifest for the given package
 */
export function generatePackageTemplate(name: string): Manifest {
  return {
    // standard things
    name,
    versions: {},
    time: {},
    [USERS]: {},
    [DIST_TAGS]: {},
    _uplinks: {},
    _distfiles: {},
    _attachments: {},
    _rev: '',
  };
}

/**
 * Normalize a manifest read from storage: ensure the object sections
 * (`versions`, `dist-tags`, `_distfiles`, `_attachments`, `_uplinks`, `time`)
 * exist, default the revision and `_id`, and normalize the dist-tags shape.
 * The manifest is mutated in place.
 * @param pkg package manifest reference
 * @return the same manifest, normalized
 */
export function normalizePackage(pkg: Manifest): Manifest {
  const pkgProperties = ['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks', 'time'];

  pkgProperties.forEach((key): void => {
    const pkgProp = pkg[key];

    if (_.isNil(pkgProp) || isObject(pkgProp) === false) {
      pkg[key] = {};
    }
  });

  if (_.isString(pkg._rev) === false) {
    debug('package %o has no revision, setting default', pkg.name);
    pkg._rev = STORAGE.DEFAULT_REVISION;
  }

  if (_.isString(pkg._id) === false) {
    pkg._id = pkg.name;
  }

  // normalize dist-tags
  normalizeDistTags(pkg);

  return pkg;
}

/**
 * Produce the next revision id in the `<counter>-<hash>` format used by the
 * storage layer, incrementing the counter of the previous revision.
 * @param rev previous revision id, eg. `2-a1b2c3`
 * @return the next revision id
 */
export function generateRevision(rev: string): string {
  const _rev = rev.split('-');

  return (+_rev[0] || 0) + 1 + '-' + generateRandomHexString();
}

/**
 * Pick the most relevant readme for a package: the manifest readme or the
 * `latest` version readme first, otherwise the first readme found across the
 * `next`, `beta`, `alpha`, `test`, `dev` and `canary` dist-tags, in that order.
 * @param pkg package manifest
 * @return the readme content, or an empty string when none is available
 */
export function getLatestReadme(pkg: Manifest): string {
  const versions = pkg['versions'] || {};
  const distTags = pkg[DIST_TAGS] || {};
  // FIXME: here is a bit tricky add the types
  const latestVersion: Version | any = distTags['latest'] ? versions[distTags['latest']] || {} : {};
  let readme = _.trim(pkg.readme || latestVersion.readme || '');
  if (readme) {
    return readme;
  }

  // In case of empty readme - trying to get ANY readme in the following order: 'next','beta','alpha','test','dev','canary'
  const readmeDistTagsPriority = ['next', 'beta', 'alpha', 'test', 'dev', 'canary'];
  readmeDistTagsPriority.map(function (tag): string | void {
    if (readme) {
      return readme;
    }
    const version: Version | any = distTags[tag] ? versions[distTags[tag]] || {} : {};
    readme = _.trim(version.readme || readme);
  });
  return readme;
}

/**
 * Remove the readme from a version object: only one readme is kept per
 * package (see getLatestReadme), never one per version. The version is
 * mutated in place.
 * @param version version metadata
 * @return the same version without its readme
 */
export function cleanUpReadme(version: Version): Version {
  if (_.isNil(version) === false) {
    // @ts-ignore
    delete version.readme;
  }

  return version;
}

/**
 * Manifest properties allowed in responses served to clients; everything
 * else is verdaccio-internal bookkeeping and is stripped by cleanUpLinksRef.
 */
export const WHITELIST = [
  '_rev',
  'name',
  'versions',
  'dist-tags',
  'readme',
  'time',
  '_id',
  'users',
];

/**
 * Strip verdaccio-internal sections (`_distfiles`, `_attachments`, ...) from
 * a manifest before serving it to a client. The manifest is mutated in place.
 * @param keepUpLinkData whether the `_uplinks` section should be preserved
 * @param result manifest to clean up
 * @return the same manifest with only whitelisted properties
 */
export function cleanUpLinksRef(keepUpLinkData: boolean, result: Manifest): Manifest {
  const propertyToKeep = [...WHITELIST];
  if (keepUpLinkData === true) {
    propertyToKeep.push('_uplinks');
  }

  for (const i in result) {
    if (propertyToKeep.indexOf(i) === -1) {
      // Remove sections like '_uplinks' from response
      delete result[i];
    }
  }

  return result;
}

/**
 * Verify a package does not exist locally yet; part of the publish flow.
 * @param name package name
 * @param localStorage local storage instance
 * @throws conflict error when the package already exists locally
 */
export async function checkPackageLocal(name: string, localStorage: LocalStorage): Promise<void> {
  debug('checking if %o already exists locally', name);
  try {
    const results = await localStorage.getPackageMetadataAsync(name);
    if (results) {
      debug('package %o already exists locally', name);
      throw ErrorCode.getConflict(API_ERROR.PACKAGE_EXIST);
    }
  } catch (err: any) {
    if (err.status === HTTP_STATUS.NOT_FOUND) {
      debug('package %o does not exist locally', name);
      return;
    }
    throw err;
  }
}

/**
 * Create a new package in the local storage and register its latest version
 * in the in-memory search indexer.
 * @param name package name
 * @param metadata package manifest to store
 * @param localStorage local storage instance
 */
export function publishPackage(
  name: string,
  metadata: any,
  localStorage: LocalStorage
): Promise<void> {
  debug('publishing a new package for %o', name);
  return new Promise((resolve, reject): void => {
    localStorage.addPackage(name, metadata, (err, latest): void => {
      if (!_.isNull(err)) {
        return reject(err);
      } else if (!_.isUndefined(latest)) {
        SearchMemoryIndexer.add(latest).catch((reason) => {
          debug('indexer has failed on add item %o', reason);
          logger.error('indexer has failed on add item');
        });
      }
      return resolve();
    });
  });
}

/**
 * Verify a package does not exist on any uplink yet; part of the publish
 * flow. Uplink failures other than 404 reject the publish, unless
 * `publish.allow_offline` is enabled in the configuration.
 * @param name package name
 * @param isAllowPublishOffline whether publishing with unreachable uplinks is allowed
 * @param syncMetadata bound Storage._syncUplinksMetadata function
 * @throws conflict error when the package exists upstream, service unavailable when uplinks are offline
 */
export function checkPackageRemote(
  name: string,
  isAllowPublishOffline: boolean,
  syncMetadata: any
): Promise<void> {
  debug('checking if %o already exists on uplinks', name);
  return new Promise((resolve, reject): void => {
    syncMetadata(name, null, {}, (err, packageJsonLocal, upLinksErrors): void => {
      // something weird
      if (err && err.status !== HTTP_STATUS.NOT_FOUND) {
        return reject(err);
      }

      // checking package exist already
      if (_.isNil(packageJsonLocal) === false) {
        debug('package %o already exists on an uplink', name);
        return reject(ErrorCode.getConflict(API_ERROR.PACKAGE_EXIST));
      }

      for (let errorItem = 0; errorItem < upLinksErrors.length; errorItem++) {
        // checking error
        // if uplink fails with a status other than 404, we report failure
        if (_.isNil(upLinksErrors[errorItem][0]) === false) {
          if (upLinksErrors[errorItem][0].status !== HTTP_STATUS.NOT_FOUND) {
            if (isAllowPublishOffline) {
              debug('uplink offline for %o, publish offline is allowed', name);
              return resolve();
            }

            debug('uplink offline for %o, rejecting publish', name);
            return reject(ErrorCode.getServiceUnavailable(API_ERROR.UPLINK_OFFLINE_PUBLISH));
          }
        }
      }

      return resolve();
    });
  });
}

/**
 * Merge the `time` field of a remote manifest into the cached one; remote
 * entries win on conflicts. Returns a new manifest, the inputs are untouched.
 * @param cacheManifest local cached manifest
 * @param remoteManifest manifest fetched from an uplink
 * @return the cached manifest with the merged time field
 */
export function mergeUplinkTimeIntoLocal(cacheManifest: Manifest, remoteManifest: Manifest): any {
  if ('time' in remoteManifest) {
    debug('merging remote time field into local manifest for %o', cacheManifest.name);
    // remote override cache time conflicts
    return { ...cacheManifest, time: { ...cacheManifest.time, ...remoteManifest.time } };
  }

  return cacheManifest;
}

/**
 * Build the search item emitted for a local package during a search stream,
 * based on its latest version: npm-search compatible maintainers
 * (`{ username, email }`), publisher (from `_npmUser`, falling back to the
 * first maintainer), license and links.
 * @param data package manifest
 * @param time modified time attached to the search item
 * @return the search item, or undefined when the package has no usable latest version
 */
export function prepareSearchPackage(data: Manifest, time: unknown): any {
  const latest = pkgUtils.getLatest(data);

  if (!latest || !data.versions[latest]) {
    debug('no latest version found for %o, skipping search item', data.name);
    return;
  }

  debug('preparing search item for %o@%o', data.name, latest);
  if (latest && data.versions[latest]) {
    const version: Version = data.versions[latest];
    const versions: any = { [latest]: 'latest' };
    // packument maintainers carry `name`, but the npm search API contract uses
    // `username` and the npm CLI crashes on entries without it — emit both
    const rawMaintainers = version.maintainers || [version.author].filter(Boolean);
    const maintainers = Array.isArray(rawMaintainers)
      ? rawMaintainers.map((maintainer: any) =>
          typeof maintainer === 'string'
            ? { username: maintainer, email: '' }
            : {
                ...maintainer,
                username: maintainer?.username ?? maintainer?.name ?? '',
                email: maintainer?.email ?? '',
              }
        )
      : [];
    // npmjs fills `publisher` with the user who published the version; use
    // `_npmUser` when the publishing client provided it and fall back to the
    // first maintainer, otherwise the npm CLI renders "published by ???"
    const npmUser = (version as any)._npmUser;
    const publisher = npmUser?.name
      ? { username: npmUser.name, email: npmUser.email ?? '' }
      : (maintainers[0] ?? {});
    const pkg: any = {
      name: version.name,
      description: version.description,
      [DIST_TAGS]: { latest },
      maintainers,
      publisher,
      author: version.author,
      repository: version.repository,
      readmeFilename: version.readmeFilename || '',
      homepage: version.homepage,
      keywords: version.keywords,
      time: {
        modified: time,
      },
      bugs: version.bugs,
      license: version.license,
      versions,
    };

    return pkg;
  }
}

/**
 * Whether the tarball url path ends with the given file name
 * (any query string is ignored, like the path parsing in updateVersions).
 */
export function tarballMatchesFilename(tarball: string, filename: string): boolean {
  return tarball.split('?')[0].endsWith(`/${filename}`);
}

/**
 * Build a distfile record from a version's dist metadata when its tarball
 * url matches the given file name.
 */
export function distFileFromVersion(version: Version, filename: string): DistFile | null {
  const dist = version?.dist;

  if (dist?.tarball && tarballMatchesFilename(dist.tarball, filename)) {
    return { url: dist.tarball, sha: dist.shasum as string };
  }

  return null;
}

/**
 * Resolve the distfile record for a tarball filename. Prefers the
 * `_distfiles` bookkeeping, but falls back to the version metadata when the
 * record is missing (storages written by other verdaccio versions cache
 * versions without their distfile records, which made those tarballs
 * permanently unavailable).
 * @param manifest cached manifest
 * @param filename tarball file name, eg. pkg-1.0.0.tgz
 */
export function lookupDistFile(manifest: Manifest, filename: string): DistFile | null {
  const distFile = manifest?._distfiles?.[filename];
  if (_.isNil(distFile) === false) {
    return distFile;
  }

  const versions = manifest?.versions ?? {};

  // tarballs are conventionally named <basename>-<version>.tgz, so the
  // version can usually be derived from the filename without scanning
  // manifests that carry thousands of versions
  const basename = manifest?.name?.replace(/^.*\//, '');
  if (basename && filename.startsWith(`${basename}-`) && filename.endsWith('.tgz')) {
    const versionId = filename.slice(basename.length + 1, -'.tgz'.length);
    const distFromVersion = distFileFromVersion(versions[versionId], filename);

    if (distFromVersion) {
      debug('distfile record missing for %o, using version %o dist', filename, versionId);
      return distFromVersion;
    }
  }

  // unconventional tarball names: fall back to a scan
  for (const versionId in versions) {
    const distFromVersion = distFileFromVersion(versions[versionId], filename);

    if (distFromVersion) {
      debug('distfile record missing for %o, using version %o dist', filename, versionId);
      return distFromVersion;
    }
  }

  debug('no distfile record or version dist found for %o', filename);
  return null;
}

/**
 * Check whether the package metadata has enough data to be published.
 * @param pkg package manifest
 * @return true when the manifest carries a versions section
 */
export function isPublishablePackage(pkg: Manifest): boolean {
  const keys: string[] = Object.keys(pkg);

  return keys.includes('versions');
}

/**
 * Whether a version declares an install lifecycle script (`install`,
 * `preinstall` or `postinstall`); surfaced in abbreviated manifests as
 * `hasInstallScript` so clients can warn about script execution.
 * @param version version metadata
 * @return true when an install script is present
 */
export function hasInstallScript(version: Version) {
  if (version?.scripts) {
    const scripts = Object.keys(version.scripts);
    return (
      scripts.find((item) => {
        return ['install', 'preinstall', 'postinstall'].includes(item);
      }) !== undefined
    );
  }
  return false;
}

/**
 * Convert a full manifest into the abbreviated format served when the client
 * requests `application/vnd.npm.install-v1+json` (npm install), keeping only
 * the fields the npm registry contract defines for installation.
 * https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
 * @param manifest full package manifest
 * @return the abbreviated manifest
 */
export function convertAbbreviatedManifest(manifest: Manifest): AbbreviatedManifest {
  if (debug.enabled) {
    debug(
      'converting %o to abbreviated manifest with %o versions',
      manifest.name,
      Object.keys(manifest.versions).length
    );
  }
  const abbreviatedVersions = Object.keys(manifest.versions).reduce(
    (acc: AbbreviatedVersions, version: string) => {
      const _version = manifest.versions[version];
      // This should be align with this document
      // https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-version-object
      const _version_abbreviated = {
        name: _version.name,
        version: _version.version,
        description: _version.description,
        deprecated: _version.deprecated,
        bin: _version.bin,
        dist: _version.dist,
        engines: _version.engines,
        cpu: _version.cpu,
        os: _version.os,
        funding: _version.funding,
        directories: _version.directories,
        dependencies: _version.dependencies,
        devDependencies: _version.devDependencies,
        peerDependencies: _version.peerDependencies,
        peerDependenciesMeta: _version.peerDependenciesMeta,
        optionalDependencies: _version.optionalDependencies,
        bundleDependencies: _version.bundleDependencies,
        // npm cli specifics
        _hasShrinkwrap: _version._hasShrinkwrap,
        hasInstallScript: hasInstallScript(_version),
      };
      acc[version] = _version_abbreviated;
      return acc;
    },
    {}
  );

  const convertedManifest = {
    name: manifest['name'],
    [DIST_TAGS]: manifest[DIST_TAGS],
    versions: abbreviatedVersions,
    // @ts-ignore
    modified: manifest?.time?.modified,
    // NOTE: special case for pnpm https://github.com/pnpm/rfcs/pull/2
    time: manifest?.time,
  };

  // @ts-ignore
  return convertedManifest;
}
