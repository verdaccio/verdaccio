import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Logo from './Logo';

describe('<Logo /> component', () => {
  test('should render the component in default state', () => {
    const { container } = render(<Logo />);
    expect(container.querySelectorAll('div')).toHaveLength(1);
    expect(screen.getByTestId('default-logo')).toBeInTheDocument();
  });

  test.skip('should show custom logo', () => {
    jest.mock('../../providers', () => ({
      useConfig: jest.fn().mockReturnValue({
        configOptions: {
          logo: 'custom.png',
        },
      }),
    }));
    const { container } = render(<Logo isDefault={false} title="test" />);
    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
  });

  test.skip('should show default logo although custom logo is in config', () => {
    jest.mock('../../providers', () => ({
      useConfig: jest.fn().mockReturnValue({
        configOptions: {
          logo: 'custom.png',
        },
      }),
    }));
    const { container } = render(<Logo isDefault={true} title="test" />);
    expect(container.querySelectorAll('div')).toHaveLength(1);
    expect(screen.getByTestId('default-logo')).toBeInTheDocument();
  });
});
