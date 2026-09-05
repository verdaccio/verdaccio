import { fireEvent, render, screen } from '@testing-library/react';
import React, { useRef } from 'react';
import { describe, expect, test, vi } from 'vitest';

import useOnClickOutside from './useOnClickOutside';

const Probe: React.FC<{ handler: (event: MouseEvent | TouchEvent) => void }> = ({ handler }) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as React.RefObject<HTMLDivElement>, handler);
  return (
    <div>
      <div data-testid="inside" ref={ref}>
        <button data-testid="child" type="button" />
      </div>
      <div data-testid="outside" />
    </div>
  );
};

describe('useOnClickOutside', () => {
  test('should call the handler when clicking outside the ref element', () => {
    const handler = vi.fn();
    render(<Probe handler={handler} />);

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('should not call the handler when clicking the element or a descendant', () => {
    const handler = vi.fn();
    render(<Probe handler={handler} />);

    fireEvent.mouseDown(screen.getByTestId('inside'));
    fireEvent.mouseDown(screen.getByTestId('child'));

    expect(handler).not.toHaveBeenCalled();
  });

  test('should also react to touch events', () => {
    const handler = vi.fn();
    render(<Probe handler={handler} />);

    fireEvent.touchStart(screen.getByTestId('outside'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('should remove the listeners on unmount', () => {
    const handler = vi.fn();
    const { unmount } = render(<Probe handler={handler} />);
    unmount();

    fireEvent.mouseDown(document.body);

    expect(handler).not.toHaveBeenCalled();
  });
});
