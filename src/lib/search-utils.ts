import { pkgUtils, searchUtils } from '@verdaccio/core';
import { Manifest, Version } from '@verdaccio/types';

export function mapManifestToSearchPackageBody(
  pkg: Manifest,
  searchItem: searchUtils.SearchItem
): searchUtils.SearchPackageBody {
  const latest = pkgUtils.getLatest(pkg);
  const version: Version = pkg.versions[latest];
  const result: searchUtils.SearchPackageBody = {
    name: version.name,
    scope: '',
    description: version.description,
    version: latest,
    keywords: version.keywords,
    date: pkg.time[latest],
    // FIXME: type
    author: version.author as any,
    // FIXME: not possible fill this out from a private package
    publisher: {},
    // FIXME: type
    maintainers: version.maintainers as any,
    links: {
      npm: '',
      homepage: version.homepage,
      repository: version.repository,
      bugs: version.bugs,
    },
  };

  if (typeof searchItem.package.scoped === 'string') {
    result.scope = searchItem.package.scoped;
  }

  return result;
}
