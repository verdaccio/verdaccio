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

export type SearchResultWeb = {
  name: string;
  version: string;
  description: string;
};
