import React from 'react';

import { GenericError, Loading, PackageList, useManifests } from '../..';
import type { ManifestWeb } from '../../providers/ManifestsProvider/ManifestsProvider';

const Home: React.FC = () => {
  const manifests = useManifests();

  if (manifests.isError) {
    return <GenericError />;
  }

  return (
    <div className="container content" data-testid="home-page-container">
      {manifests.isLoading ? (
        <Loading />
      ) : (
        <PackageList packages={manifests.manifests as ManifestWeb[]} />
      )}
    </div>
  );
};

export default Home;
