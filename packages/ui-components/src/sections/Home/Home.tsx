import React from 'react';

import { Loading, PackageList, useManifests } from '../..';

const Home: React.FC = () => {
  const manifests = useManifests();
  console.log('home manifests', manifests);

  if (manifests.isError) {
    return <div>Error loading manifests</div>;
  }

  return (
    <div className="container content" data-testid="home-page-container">
      {manifests.isLoading ? <Loading /> : <PackageList packages={manifests.manifests as any} />}
      {manifests.isError && <div>Error loading manifests</div>}
    </div>
  );
};

export default Home;
