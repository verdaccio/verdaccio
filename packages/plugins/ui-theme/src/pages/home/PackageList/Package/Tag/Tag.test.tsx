import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import Tag from './Tag';

describe('<Tag /> component', () => {
  test('should load the component in default state', () => {
    const { container } = render(
      <Tag>
        <span>{'I am a child'}</span>
      </Tag>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
