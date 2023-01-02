import React from 'react';

import { render } from '../../test/test-react-testing-library';
import Repository from './Repository';
import data from './__partials__/data.json';

describe('<Repository /> component', () => {
  test('should load the component in default state', () => {
    const { container } = render(<Repository packageMeta={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render the component in with no repository data', () => {
    const packageMeta = {
      ...data,
      latest: {
        ...data?.latest,
        repository: undefined,
      },
    };

    const { queryByText } = render(<Repository packageMeta={packageMeta} />);

    expect(queryByText('Repository')).toBeFalsy();
  });

  test('should render the component in with invalid url', () => {
    const packageMeta = {
      ...data,
      latest: {
        ...data?.latest,
        repository: {
          type: 'git',
          url: 'git://github.com/verdaccio/ui.git',
        },
      },
    };

    const { queryByText } = render(<Repository packageMeta={packageMeta} />);

    expect(queryByText('Repository')).toBeFalsy();
  });
});
