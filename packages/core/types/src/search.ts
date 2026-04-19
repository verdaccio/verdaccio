export type PublisherMaintainer = {
  username: string;
  email: string;
};

export type SearchPackageBody = {
  name: string;
  scope: string;
  description: string;
  author: string | PublisherMaintainer;
  version: string;
  keywords: string | string[] | undefined;
  date: string;
  links?: {
    npm: string; // only include placeholder for URL eg: {url}/{packageName}
    homepage?: string;
    repository?: string;
    bugs?: string;
  };
  publisher?: any;
  maintainers?: PublisherMaintainer[];
};

/**
 * Flat response shape, e.g. from the local registry packument-style search:
 *
 * ```json
 * { "name": "...", "version": "...", "description": "...", "dist": { ... } }
 * ```
 */
export type SearchResultWebFlat = {
  name: string;
  version: string;
  description?: string;
  main?: string;
  readmeFilename?: string;
  dependencies?: Record<string, string>;
  dist?: {
    shasum?: string;
    tarball?: string;
  };
  contributors?: unknown[];
};

/**
 * npm-style "search objects" response where each entry is wrapped in a
 * `package` envelope and carries verdaccio-specific metadata flags.
 */
export type SearchResultWebWrapped = {
  package: {
    name: string;
    version: string;
    description?: string;
    scope?: string;
    keywords?: string[];
    date?: string;
    author?: PublisherMaintainer | { name?: string; email?: string };
    publisher?: any;
    maintainers?: Array<{ name?: string; email?: string }>;
    links?: {
      npm?: string;
      homepage?: string;
      repository?: any;
      bugs?: any;
    };
  };
  score?: {
    final?: number;
    detail?: {
      maintenance?: number;
      popularity?: number;
      quality?: number;
    };
  };
  searchScore?: number;
  verdaccioPkgCached?: boolean;
  verdaccioPrivate?: boolean;
};

/**
 * Union of the two search response shapes the web UI can consume.
 * The Search component auto-detects the shape at render time — no feature
 * flag is required to switch between them.
 */
export type SearchResultWeb = SearchResultWebFlat | SearchResultWebWrapped;
