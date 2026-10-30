import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import { GenericError, PackageList, PackageListSkeleton, useConfig, useManifests } from '../..';
import NoItems from '../../components/NoItems';
import PackageListToolbar from '../../components/PackageList/PackageListToolbar';
import {
  PackageSort,
  filterPackages,
  getScopes,
} from '../../components/PackageList/filterPackages';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { ManifestWeb } from '../../providers/ManifestsProvider/ManifestsProvider';

const QUERY_PARAM = 'q';
const SCOPE_PARAM = 'scope';
const SORT_STORAGE_KEY = 'package-list-sort';
const EMPTY: ManifestWeb[] = [];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const manifests = useManifests();
  const { configOptions } = useConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const [storedSort, setSort] = useLocalStorage<PackageSort>(SORT_STORAGE_KEY, PackageSort.DEFAULT);
  const sort = Object.values(PackageSort).includes(storedSort) ? storedSort : PackageSort.DEFAULT;
  const packages = (manifests.manifests as ManifestWeb[] | undefined) ?? EMPTY;
  const scopes = useMemo(() => getScopes(packages), [packages]);
  const query = searchParams.get(QUERY_PARAM) ?? '';
  const requestedScope = searchParams.get(SCOPE_PARAM) ?? '';
  const scope = scopes.includes(requestedScope) ? requestedScope : '';
  const visiblePackages = useMemo(
    () => filterPackages(packages, { query, scope, sort }),
    [packages, query, scope, sort]
  );

  // replace instead of push: one history entry per keystroke would make "back" useless
  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (params) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
        return params;
      },
      { replace: true }
    );
  };

  if (manifests.isError) {
    return <GenericError />;
  }

  const renderList = () => {
    // without the toolbar the list keeps the server order: nothing on screen could change it
    if (packages.length <= 1 || configOptions.showPackageListToolbar === false) {
      return <PackageList onEndReached={manifests.loadMore} packages={packages} />;
    }
    return (
      <>
        <PackageListToolbar
          onQueryChange={(value) => updateParam(QUERY_PARAM, value)}
          onScopeChange={(value) => updateParam(SCOPE_PARAM, value)}
          onSortChange={setSort}
          query={query}
          scope={scope}
          scopes={scopes}
          shown={visiblePackages.length}
          sort={sort}
          total={packages.length}
        />
        {visiblePackages.length > 0 ? (
          <PackageList
            key={`${query}|${scope}|${sort}`}
            onEndReached={manifests.loadMore}
            packages={visiblePackages}
          />
        ) : (
          <div data-testid="package-list-no-match">
            <NoItems text={t('packageList.no-match')} />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container content" data-testid="home-page-container">
      {manifests.isLoading ? <PackageListSkeleton /> : renderList()}
    </div>
  );
};

export default Home;
