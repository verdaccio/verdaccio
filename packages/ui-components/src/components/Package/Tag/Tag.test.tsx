import React from 'react';

import { render } from '../../../test/test-react-testing-library';
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
