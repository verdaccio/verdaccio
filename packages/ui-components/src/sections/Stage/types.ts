/**
 * A package version awaiting review, as served by `GET /-/stage`.
 *
 * Mirrors the `StagePackageVersion` schema documented by npmjs.
 */
export interface StagePackageVersion {
  id: string;
  packageName: string;
  version: string;
  tag: string;
  createdAt: string;
  actor: string;
  actorType: string;
  access: 'public' | 'private';
  shasum: string;
}

export interface StagePackageList {
  items: StagePackageVersion[];
  page: number;
  perPage: number;
  total: number;
}
