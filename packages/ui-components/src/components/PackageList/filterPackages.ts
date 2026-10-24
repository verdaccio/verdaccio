import type { ManifestWeb } from '../../providers/ManifestsProvider/ManifestsProvider';

export enum PackageSort {
  DEFAULT = 'default',
  NAME = 'name',
  RECENT = 'recent',
}

export const NO_SCOPE = '-';

export type PackageFilter = {
  query?: string;
  scope?: string;
  sort?: PackageSort;
};

export function getPackageScope(name: string): string {
  return name.startsWith('@') && name.includes('/') ? name.slice(0, name.indexOf('/')) : NO_SCOPE;
}

export function getScopes(packages: ManifestWeb[]): string[] {
  return Array.from(new Set(packages.map((pkg) => getPackageScope(pkg.name)))).sort((a, b) =>
    a === NO_SCOPE ? 1 : b === NO_SCOPE ? -1 : a.localeCompare(b)
  );
}

function matchesQuery(pkg: ManifestWeb, query: string): boolean {
  const keywords = Array.isArray(pkg.keywords) ? pkg.keywords : [];
  return [pkg.name, pkg.description ?? '', ...keywords].some((field) =>
    String(field).toLowerCase().includes(query)
  );
}

const publishedAt = (pkg: ManifestWeb): number =>
  pkg.time ? new Date(pkg.time).getTime() || 0 : 0;

/** Filters and sorts the home list; `PackageSort.DEFAULT` keeps the order configured on the server. */
export function filterPackages(
  packages: ManifestWeb[],
  { query = '', scope = '', sort = PackageSort.DEFAULT }: PackageFilter
): ManifestWeb[] {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = packages.filter(
    (pkg) =>
      (!scope || getPackageScope(pkg.name) === scope) &&
      (!normalizedQuery || matchesQuery(pkg, normalizedQuery))
  );
  if (sort === PackageSort.NAME) {
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === PackageSort.RECENT) {
    return filtered.sort((a, b) => publishedAt(b) - publishedAt(a));
  }
  return filtered;
}
