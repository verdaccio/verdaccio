export interface PackageAccess {
  storage?: string;
  publish?: string[];
  proxy?: string[];
  access?: string[];
  unpublish?: string[] | boolean; // false means fallback to publish
}

export interface PackageList {
  [key: string]: PackageAccess;
}

export interface MergeTags {
  [key: string]: string;
}

export interface DistFile {
  url: string;
  sha: string;
  registry?: string;
}

export interface DistFiles {
  [key: string]: DistFile;
}

export interface Token {
  user: string;
  token: string;
  key: string;
  cidr?: string[];
  readonly: boolean;
  created: number | string;
  updated?: number | string;
}

export interface AttachMents {
  [key: string]: AttachMentsItem;
}

export interface AttachMentsItem {
  content_type?: string;
  data?: string;
  length?: number;
  shasum?: string;
  version?: string;
}

export interface GenericBody {
  [key: string]: string;
}

export interface UpLinkMetadata {
  etag: string;
  fetched: number;
}

export interface UpLinks {
  [key: string]: UpLinkMetadata;
}

export interface Signatures {
  keyid: string;
  sig: string;
}

export interface Dist {
  'npm-signature'?: string;
  signatures?: Signatures[];
  fileCount?: number;
  integrity?: string;
  shasum: string;
  unpackedSize?: number;
  tarball: string;
}

export interface Author {
  username?: string;
  name: string;
  email?: string;
  url?: string;
  _avatar?: string; // for web ui
}

export type Person = Author | string;

export interface PackageUsers {
  [key: string]: boolean;
}

export interface Tags {
  [key: string]: Version;
}

export interface PeerDependenciesMeta {
  [dependencyName: string]: {
    optional?: boolean;
  };
}

export interface Version {
  name: string;
  version: string;
  directories?: any;
  dist: Dist;
  author: Person;
  main: string;
  homemage?: string;
  license?: string;
  readme: string;
  readmeFileName?: string;
  readmeFilename?: string;
  description: string;
  bin?: string;
  bugs?: any;
  files?: string[];
  gitHead?: string;
  maintainers?: Person[];
  contributors?: Person[];
  repository?: string | any;
  scripts?: any;
  homepage?: string;
  etag?: string;
  dependencies?: Dependencies;
  peerDependencies?: Dependencies;
  devDependencies?: Dependencies;
  optionalDependencies?: Dependencies;
  peerDependenciesMeta?: PeerDependenciesMeta;
  bundleDependencies?: string[];
  acceptDependencies?: Dependencies;
  keywords?: string | string[];
  nodeVersion?: string;
  _id: string;
  _npmVersion?: string;
  _npmUser: Author;
  _hasShrinkwrap?: boolean;
  deprecated?: string;
  funding?: { type: string; url: string };
  engines?: Engines;
  hasInstallScript?: boolean;
  cpu?: string[];
  os?: string[];
}

export interface Dependencies {
  [key: string]: string;
}

export interface Engines {
  [key: string]: string;
}

export interface Versions {
  [key: string]: Version;
}

/**
 * @deprecated use Manifest instead
 */
export interface Package {
  _id?: string;
  name: string;
  versions: Versions;
  'dist-tags': GenericBody;
  time: GenericBody;
  readme?: string;
  users?: PackageUsers;
  _distfiles: DistFiles;
  _attachments: AttachMents;
  _uplinks: UpLinks;
  _rev: string;
}

/**
 * Represents upstream manifest from another registry
 */
export interface FullRemoteManifest {
  _id?: string;
  _rev?: string;
  name: string;
  description?: string;
  'dist-tags': GenericBody;
  time: GenericBody;
  versions: Versions;
  /** store owners of this package */
  maintainers?: Person[];
  contributors?: Person[];
  /** store the latest readme **/
  readme?: string;
  /** store star assigned to this packages by users */
  users?: PackageUsers;
  // TODO: not clear what access exactly means
  access?: any;
  bugs?: { url: string };
  license?: string;
  homepage?: string;
  repository?: string | { type?: string; url: string; directory?: string };
  keywords?: string[];
  author?: Person;
}

export interface Manifest extends FullRemoteManifest, PublishManifest {
  // private fields only used by verdaccio
  /**
   * store fast access to the dist url of an specific tarball, instead search version
   * by id, just the tarball id is faster.
   *
   * The _distfiles is created only when a package is being sync from an upstream.
   * also used to fetch tarballs from upstream, the private publish tarballs are not stored in
   * this object because they are not published in the upstream registry.
   */
  _distfiles: DistFiles;
  /**
   * Store access cache metadata, to avoid to fetch the same metadata multiple times.
   *
   * The key represents the uplink id which is composed of a etag and a fetched timestamp.
   *
   * The fetched timestamp is the time when the metadata was fetched, used to avoid to fetch the
   * same metadata until the metadata is older than the last fetch.
   */
  _uplinks: UpLinks;
  /**
   * store the revision of the manifest
   */
  _rev: string;
}

export type AbbreviatedVersion = Pick<
  Version,
  | 'name'
  | 'version'
  | 'dependencies'
  | 'devDependencies'
  | 'bin'
  | 'dist'
  | 'engines'
  | 'funding'
  | 'peerDependencies'
  | 'cpu'
  | 'deprecated'
  | 'directories'
  | 'hasInstallScript'
  | 'optionalDependencies'
  | 'os'
  | 'peerDependenciesMeta'
  | 'acceptDependencies'
  | '_hasShrinkwrap'
>;

export interface AbbreviatedVersions {
  [key: string]: AbbreviatedVersion;
}
/**
 *
 */
export type AbbreviatedManifest = Pick<Manifest, 'name' | 'dist-tags' | 'time'> & {
  modified: string;
  versions: AbbreviatedVersions;
};

/**
 *
 */
export type UnPublishManifest = Omit<Manifest, '_attachments' | '_distfiles' | '_uplinks'>;

export interface PublishManifest {
  /**
   * The `_attachments` object has different usages:
   *
   * - When a package is published, it contains the tarball as an string, this string is used to be
   * converted as a tarball, usually attached to the package but not stored in the database.
   * - If user runs `npm star` the _attachments will be at the manifest body but empty.
   *
   * It has also an internal usage:
   *
   * - Used as a cache for the tarball, quick access to the tarball shasum, etc. Instead
   * iterate versions and find the right one, just using the tarball as a key which is what
   * the package manager sends to the registry.
   *
   * - A `_attachments` object is added every time a private tarball is published, upstream cached tarballs are
   * not being part of this object, only for published private packages.
   *
   * Note: This field is removed when the package is accesed through the web user interface.
   * */
  _attachments: AttachMents;
}

/**
 * Web user interface hoists the selected version to "latest" and adds "dist.tarball" field.
 */
export interface WebManifest extends Manifest {
  latest?: Version;
  dist?: { tarball: string };
}
