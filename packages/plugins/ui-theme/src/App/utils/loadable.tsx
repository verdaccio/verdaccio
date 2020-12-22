import React, { lazy, Suspense } from 'react';
export default (importCallback: any) => {
  const TargetComponent = lazy(importCallback);
  return (props: any) => (
    <Suspense fallback={null}>
      <TargetComponent {...props} />
    </Suspense>
  );
};
