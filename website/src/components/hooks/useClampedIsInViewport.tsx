import { useEffect, useState } from 'react';
import useIsInViewport, { CallbackRef, HookOptions } from 'use-is-in-viewport';

function useClampedIsInViewport(options: HookOptions): [boolean, CallbackRef, CallbackRef] {
  const [isInViewport, ...etc] = useIsInViewport(options);
  const [wasInViewportAtleastOnce, setWasInViewportAtleastOnce] = useState(isInViewport);

  useEffect(() => {
    setWasInViewportAtleastOnce((prev) => {
      // this will clamp it to the first true
      // received from useIsInViewport
      if (!prev) {
        return isInViewport;
      }
      return prev;
    });
  }, [isInViewport]);

  return [wasInViewportAtleastOnce, ...etc];
}

export default useClampedIsInViewport;
