export interface PackageAccess {
  storage?: string;
  publish?: string[];
  proxy?: string[];
  access?: string[];
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

export interface Dist {
  integrity?: string;
  shasum: string;
  tarball: string;
}

export interface Author {
  name: string;
  email?: string;
  url?: string;
}

export interface PackageUsers {
  [key: string]: boolean;
}

export interface Version {
  name: string;
  version: string;

  directories?: any;
  dist: Dist;
  author: string | Author;
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
  maintainers?: Author[];
  contributors?: Author[];
  repository?: string | any;
  scripts?: any;
  homepage?: string;
  etag?: string;
  dependencies?: Dependencies;
  peerDependencies?: Dependencies;
  peerDependenciesMeta?: PeerDependenciesMeta;
  devDependencies?: Dependencies;
  optionalDependencies?: Dependencies;
  bundleDependencies?: Dependencies;
  keywords?: string | string[];
  nodeVersion?: string;
  _id: string;
  _npmVersion?: string;
  _npmUser: Author;
  _hasShrinkwrap?: boolean;
  deprecated?: string;
  funding?: { type: string; url: string };
  engines?: Engines;
  cpu?: string[];
  os?: string[];
  hasInstallScript?: boolean;
}

export interface PeerDependenciesMeta {
  [dependencyName: string]: {
    optional?: boolean;
  };
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

export type AbbreviatedVersion = Pick<
  Version,
  | 'name'
  | 'version'
  | 'description'
  | 'dependencies'
  | 'devDependencies'
  | 'bin'
  | 'dist'
  | 'engines'
  | 'funding'
  | 'peerDependencies'
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

// @deprecated
export type Package = Manifest;

export interface Manifest {
  _id?: string;
  name: string;
  versions: Versions;
  'dist-tags': GenericBody;
  time?: GenericBody;
  readme?: string;
  users?: PackageUsers;
  _distfiles: DistFiles;
  _attachments: AttachMents;
  _uplinks: UpLinks;
  _rev: string;
}
