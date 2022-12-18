export type Origin = 'core' | 'community';
export type Category = 'middleware' | 'authentication' | 'filter' | 'storage' | 'ui' | 'tool';

export type Addon = {
  name: string;
  url: string;
  category: Category;
  bundled: boolean;
  origin: Origin;
  latest: string;
  downloads: number;
  description: string;
};

export type Filters = {
  bundled: boolean;
  core: boolean;
  community: boolean;
  middleware: boolean;
  storage: boolean;
  tool: boolean;
  ui: boolean;
  authentication: boolean;
  filter: boolean;
  keyword: string;
};
