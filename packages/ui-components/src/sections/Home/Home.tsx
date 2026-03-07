import React from 'react';

import { Loading, PackageList, useManifests } from '../..';
import type { ManifestWeb } from '../../providers/ManifestsProvider/ManifestsProvider';

const Home: React.FC = () => {
  const manifests = useManifests();

  if (manifests.isError) {
    return <div>Error loading manifests</div>;
  }

  return (
    <div className="container content" data-testid="home-page-container">
      {manifests.isLoading ? (
        <Loading />
      ) : (
        <PackageList packages={manifests.manifests as ManifestWeb[]} />
      )}
      {manifests.isError && <div>{'Error loading manifests'}</div>}
    </div>
  );
};

export default Home;
