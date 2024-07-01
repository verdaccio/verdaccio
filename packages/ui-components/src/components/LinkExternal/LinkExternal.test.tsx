import React from 'react';

import { render } from '../../test/test-react-testing-library';
import LinkExternal from './LinkExternal';

describe('<LinkExternal /> component', () => {
  test('should render the component in default state', () => {
    const { container } = render(<LinkExternal to={'/'} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render the component with external link', () => {
    const { container } = render(
      <LinkExternal to={'https://example.com'}>{'Example'}</LinkExternal>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
