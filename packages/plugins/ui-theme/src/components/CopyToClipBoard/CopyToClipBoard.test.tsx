import React from 'react';

import { copyToClipBoardUtility } from 'verdaccio-ui/utils/cli-utils';
import { render, cleanup, fireEvent } from 'verdaccio-ui/utils/test-react-testing-library';

import CopyToClipBoard from './CopyToClipBoard';

jest.mock('verdaccio-ui/utils/cli-utils');

describe('<CopyToClipBoard /> component', () => {
  let wrapper: any;
  const copyText = 'copy text';

  beforeEach(() => {
    cleanup();
    wrapper = render(<CopyToClipBoard text={copyText} />);
  });

  test('should load the component in default state', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should call the copyToClipBoardUtility for copy to clipboard utility', () => {
    fireEvent.click(wrapper.getByTestId('copy-icon'));
    expect(copyToClipBoardUtility).toHaveBeenCalledWith(copyText);
  });
});
