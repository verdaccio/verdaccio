import { useEffect } from 'react';

// based on https://usehooks.com/useOnClickOutside/
function useOnClickOutside<R extends HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>(
  ref: React.RefObject<R>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export { useOnClickOutside };
