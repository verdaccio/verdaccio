/* eslint-disable verdaccio/jsx-spread */
import React, { Suspense, lazy } from 'react';

/**
 * With the combination of a bundler, enable to code split a package.
 *
 * const VersionPage = loadable(() => import(/'../pages/Version'));
 */
export default (importCallback: any) => {
  const TargetComponent = lazy(importCallback);
  return (props: any) => (
    <Suspense fallback={null}>
      <TargetComponent {...props} />
    </Suspense>
  );
};
