import React from 'react';
import { vi } from 'vitest';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import CopyToClipBoard from './CopyToClipBoard';

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockImplementation(() => Promise.resolve()) },
});

describe('CopyToClipBoard component', () => {
  test('should copy text to clipboard', async () => {
    const copyThis = 'copy this';
    render(
      <CopyToClipBoard dataTestId={'copy-component'} text={copyThis} title={`npm i verdaccio`} />
    );
    expect(screen.getByTestId('copy-component')).toBeInTheDocument();

    const copyComponent = await screen.findByTestId('copy-component');
    await fireEvent.click(copyComponent);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(copyThis);
  });

  test('should fall back to execCommand when the clipboard API is unavailable', async () => {
    // plain-http deployments run outside a secure context: navigator.clipboard is undefined
    const clipboard = navigator.clipboard;
    // @ts-ignore - simulating a non-secure context
    delete (navigator as any).clipboard;
    const execCommand = vi.fn().mockReturnValue(true);
    Object.assign(document, { execCommand });
    // the shared vitest setup replaces document.createRange with a plain object,
    // which jsdom's real Selection rejects; stub the selection to match
    vi.spyOn(window, 'getSelection').mockReturnValue({
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    } as unknown as Selection);

    render(<CopyToClipBoard dataTestId={'copy-component'} text={'copy this'} title={'title'} />);
    await fireEvent.click(await screen.findByTestId('copy-component'));

    expect(execCommand).toHaveBeenCalledWith('copy');
    Object.assign(navigator, { clipboard });
  });
});
