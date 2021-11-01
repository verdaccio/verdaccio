import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'verdaccio-ui/components/Loading';

import { Dispatch, RootState } from '../../store/store';
import { PackageList } from './PackageList';

const Home: React.FC = () => {
  const packages = useSelector((state: RootState) => state.packages.response);
  const isLoading = useSelector((state: RootState) => state?.loading?.models.packages);
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    dispatch.packages.getPackages();
  }, [dispatch]);

  return (
    <div className="container content" data-testid="home-page-container">
      {isLoading ? <Loading /> : <PackageList packages={packages} />}
    </div>
  );
};

export default Home;
