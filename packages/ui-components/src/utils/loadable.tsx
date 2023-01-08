/* eslint-disable verdaccio/jsx-spread */
import React, { Suspense, lazy } from 'react';

/**
 *  With the combination of a bundler, enable to code split a package.
 * 
 *  @example
    ```jsx
    const VersionPage = loadable(() => import(/'../pages/Version'));
   ```
   @category HOC
 */
export default (importCallback: any) => {
  const TargetComponent = lazy(importCallback);
  return (props: any) => (
    <Suspense fallback={null}>
      <TargetComponent {...props} />
    </Suspense>
  );
};
