import React from 'react';

import { cleanup, fireEvent, render } from '../../test/test-react-testing-library';
import Developers from './Developers';
import { DeveloperType } from './Title';

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

  test('should test onClick the component avatar', () => {
    const packageMeta = {
      latest: {
        packageName: 'foo',
        version: '1.0.0',
        contributors: [
          {
            name: 'dmethvin',
            email: 'test@gmail.com',
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

    // const item2 = wrapper.find(Fab);
    // // TODO: I am not sure here how to verify the method inside the component was called.
    // item2.simulate('click');

    expect(wrapper.getByText('sidebar.contributors.title')).toBeInTheDocument();
    fireEvent.click(wrapper.getByRole('button'));

    expect(wrapper.getByLabelText(packageMeta.latest.contributors[0].name)).toBeInTheDocument();
    expect(wrapper.getByLabelText(packageMeta.latest.contributors[1].name)).toBeInTheDocument();
  });
});
