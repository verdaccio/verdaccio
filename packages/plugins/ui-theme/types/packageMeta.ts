export type ModuleType = 'commonjs' | 'module';

export interface PackageMetaInterface {
  versions?: Versions;
  'dist-tags'?: DistTags;
  time?: Time;
  latest: {
    author?: Author;
    deprecated?: string;
    name: string;
    dist: {
      fileCount: number;
      unpackedSize: number;
      tarball?: string;
    };
    engines?: {
      node?: string;
      npm?: string;
    };
    license?: Partial<LicenseInterface> | string;
    version: string;
    homepage?: string;
    bugs?: {
      url: string;
    };
    repository?: {
      type?: string;
      url?: string;
    };
    main?: string;
    type?: ModuleType;
    types?: string;
    description?: string;
    funding?: Funding;
    maintainers?: Developer[];
    contributors?: Developer[];
  };
  _uplinks: Record<string, { fetched: number }>;
}
export interface Developer {
  name: string;
  email: string;
  avatar: string;
}

interface Funding {
  type?: string;
  url: string;
}

interface LicenseInterface {
  type: string;
  url: string;
}

export interface DistTags {
  [key: string]: string;
}

export interface Time {
  [key: string]: string;
}

export interface Versions {
  [key: string]: Version;
}

export interface Version {
  name: string;
  version: string;
  author?: string | Author;
  description?: string;
  license?: string;
  main?: string;
  keywords?: string[];
}

export interface Author {
  name?: string;
  email?: string;
  url?: string;
  avatar?: string;
}

export interface PackageDependencies {
  [key: string]: string;
}
