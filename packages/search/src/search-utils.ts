import { orderBy } from 'lodash-es';

import type { searchUtils } from '@verdaccio/core';

export function removeDuplicates(results: searchUtils.SearchPackageItem[]) {
  const pkgNames: any[] = [];
  const orderByResults = orderBy(results, ['verdaccioPrivate', 'asc']);
  return orderByResults.filter((pkg) => {
    if (pkgNames.includes(pkg?.package?.name)) {
      return false;
    }
    pkgNames.push(pkg?.package?.name);
    return true;
  });
}
