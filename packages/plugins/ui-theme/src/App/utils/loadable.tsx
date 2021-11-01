/* eslint-disable verdaccio/jsx-spread */
import React, { Suspense, lazy } from 'react';

export default (importCallback: any) => {
  const TargetComponent = lazy(importCallback);
  return (props: any) => (
    <Suspense fallback={null}>
      <TargetComponent {...props} />
    </Suspense>
  );
};
