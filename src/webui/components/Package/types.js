/**
 * @prettier
 * @flow
 */

export interface IProps {
  name: string;
  version: string;
  time: string;
  author: IAuthor;
  description?: string;
  keywords?: string[];
  license?: string;
  homepage: string;
  bugs: IBugs;
  dist: IDist;
}

export interface IAuthor {
  name: string;
  avatar: string;
  email: string;
}

export interface IBugs {
  url: string;
}
export interface IDist {
  unpackedSize: number;
}
