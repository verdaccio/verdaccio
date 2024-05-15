import React from 'react';

import { cleanup, fireEvent, render, screen } from '../../test/test-react-testing-library';
import { DeveloperType } from './DeveloperType';
import Developers from './Developers';

describe('test Developers', () => {
  afterEach(() => {
    cleanup();
  });

  const packageMeta = {
    latest: {
      packageName: 'foo',
      version: '1.0.0',
      maintainers: [
        {
          name: 'dmethvin',
          email: 'test@gmail.com',
        },
        {
          name: 'mgol',
          email: 'm.goleb@gmail.com',
        },
      ],
      contributors: [
        {
          name: 'dmethvin',
          email: 'test@gmail.com',
        },
        {
          name: 'mgol',
          email: 'm.goleb@gmail.com',
        },
      ],
    },
  };

  test('should render the component with no items', () => {
    const packageMeta = {
      latest: {},
    };
    const wrapper = render(
      <Developers packageMeta={packageMeta} type={DeveloperType.MAINTAINERS} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  test('should render the component for maintainers with items', () => {
    const wrapper = render(
      <Developers packageMeta={packageMeta} type={DeveloperType.MAINTAINERS} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  test('should render the component for contributors with items', () => {
    const wrapper = render(
      <Developers packageMeta={packageMeta} type={DeveloperType.CONTRIBUTORS} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  test('should show only up to max items', () => {
    const packageMeta = {
      latest: {
        packageName: 'foo',
        version: '1.0.0',
        contributors: [
          {
            name: 'dmethvin',
            email: 'test@gmail.com',
            url: 'https://example.com/',
          },
          {
            name: 'dmethvin2',
            email: 'test2@gmail.com',
          },
          {
            name: 'dmethvin3',
            email: 'test3@gmail.com',
          },
        ],
      },
    };

    const wrapper = render(
      <Developers packageMeta={packageMeta} type={DeveloperType.CONTRIBUTORS} visibleMax={1} />
    );

    expect(wrapper.getByText('sidebar.contributors.title')).toBeInTheDocument();
    expect(wrapper.getByTestId(packageMeta.latest.contributors[0].name)).toBeInTheDocument();
    expect(wrapper.queryByTestId(packageMeta.latest.contributors[1].name)).not.toBeInTheDocument();
    expect(wrapper.queryByTestId(packageMeta.latest.contributors[2].name)).not.toBeInTheDocument();
  });

  test('renders only the first six contributors when there are more than six', () => {
    const packageMeta = {
      latest: {
        contributors: [
          { name: 'contributor1', email: 'c1@test.com' },
          { name: 'contributor2', email: 'c2@test.com' },
          { name: 'contributor3', email: 'c3@test.com' },
          { name: 'contributor4', email: 'c4@test.com' },
          { name: 'contributor5', email: 'c5@test.com' },
          { name: 'contributor6', email: 'c6@test.com' },
          { name: 'contributor7', email: 'c7@test.com' },
        ],
      },
    };

    render(<Developers packageMeta={packageMeta} type={DeveloperType.CONTRIBUTORS} />);

    expect(screen.getByTestId('contributor1')).toBeInTheDocument();
    expect(screen.getByTestId('contributor2')).toBeInTheDocument();
    expect(screen.getByTestId('contributor3')).toBeInTheDocument();
    expect(screen.getByTestId('contributor4')).toBeInTheDocument();
    expect(screen.getByTestId('contributor5')).toBeInTheDocument();
    expect(screen.getByTestId('contributor6')).toBeInTheDocument();
    expect(screen.queryByTestId('contributor7')).not.toBeInTheDocument();
    expect(screen.getByTestId('fab-add')).toBeInTheDocument();

    // click on "more"
    fireEvent.click(screen.getByTestId('fab-add'));
    expect(screen.getByTestId('contributor7')).toBeInTheDocument();
  });
});
