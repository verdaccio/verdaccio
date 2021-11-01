export type SearchMetrics = {
  quality: number;
  popularity: number;
  maintenance: number;
};
export type UnStable = {
  flags?: {
    // if is false is not be included in search results (majority are stable)
    unstable?: boolean;
  };
};
export type SearchItemPkg = {
  name: string;
  scoped?: string;
  path?: string;
  time?: number | Date;
};

export type SearchItem = {
  package: SearchItemPkg;
  score: Score;
} & UnStable;

export type Score = {
  final: number;
  detail: SearchMetrics;
};

export type SearchResults = {
  objects: SearchItemPkg[];
  total: number;
  time: string;
};

type PublisherMaintainer = {
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

export type SearchPackageItem = {
  package: SearchPackageBody;
  score: Score;
  searchScore?: number;
} & UnStable;

export const UNSCOPED = 'unscoped';

export type SearchQuery = {
  text: string;
  size?: number;
  from?: number;
} & SearchMetrics;
