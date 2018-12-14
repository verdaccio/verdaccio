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
}

export interface IAuthor {
  name: string;
  avatar: string;
  email: string;
}
