import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Keywords from './Keywords';

describe('<Keywords /> component', () => {
  test('should render the component in default state', () => {
    const packageMeta = {
      latest: {
        name: 'verdaccio1',
        version: '4.0.0',
        keywords: ['verdaccio', 'npm', 'yarn'],
      },
    };

    const container = render(<Keywords packageMeta={packageMeta} />);

    expect(container.getByText('sidebar.keywords.title')).toBeInTheDocument();
    expect(container.getByText('verdaccio')).toBeInTheDocument();
    expect(container.getByText('npm')).toBeInTheDocument();
    expect(container.getByText('yarn')).toBeInTheDocument();
  });

  test('should not render if data is missing', () => {
    // @ts-ignore
    render(<Keywords packageMeta={{}} />);
    expect(screen.queryByTestId('keyword-list')).toBeNull();
  });
});
