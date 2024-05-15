import React from 'react';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import CopyToClipBoard from './CopyToClipBoard';

Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockImplementation(() => Promise.resolve()) },
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
});
