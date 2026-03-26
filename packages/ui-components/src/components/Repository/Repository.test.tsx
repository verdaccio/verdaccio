import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Repository from './Repository';
import data from './__partials__/data.json';

describe('<Repository /> component', () => {
  test('should load the component in default state', () => {
    const { container } = render(<Repository packageMeta={data} />);
    // data.latest has no repository field, so the component renders nothing
    expect(container.firstChild).toBeNull();
  });

  test('should render repository link when valid url is provided', () => {
    const packageMeta = {
      ...data,
      latest: {
        ...data?.latest,
        repository: {
          type: 'git',
          url: 'git+https://github.com/verdaccio/monorepo.git',
        },
      },
    };

    render(<Repository packageMeta={packageMeta} />);
    expect(screen.getByText('sidebar.repository.title')).toBeTruthy();
    expect(screen.getByTestId('repositoryID')).toBeTruthy();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/verdaccio/monorepo.git');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
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
