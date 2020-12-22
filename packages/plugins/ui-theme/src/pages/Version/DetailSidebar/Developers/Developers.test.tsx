import React from 'react';

import { render, cleanup, fireEvent } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContextProvider } from '../../context';

import Developers from './Developers';
import { DeveloperType } from './types';

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
      // @ts-ignore
      <DetailContextProvider value={{ packageMeta }}>
        <Developers type={DeveloperType.MAINTAINERS} />
      </DetailContextProvider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  test('should render the component for maintainers with items', () => {
    const wrapper = render(
      // @ts-ignore
      <DetailContextProvider value={{ packageMeta }}>
        <Developers type={DeveloperType.MAINTAINERS} />
      </DetailContextProvider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  test('should render the component for contributors with items', () => {
    const wrapper = render(
      // @ts-ignore
      <DetailContextProvider value={{ packageMeta }}>
        <Developers type={DeveloperType.CONTRIBUTORS} />
      </DetailContextProvider>
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
      // @ts-ignore
      <DetailContextProvider value={{ packageMeta }}>
        <Developers type={DeveloperType.CONTRIBUTORS} visibleMax={1} />
      </DetailContextProvider>
    );

    // const item2 = wrapper.find(Fab);
    // // TODO: I am not sure here how to verify the method inside the component was called.
    // item2.simulate('click');

    expect(wrapper.getByText('Contributors')).toBeInTheDocument();
    fireEvent.click(wrapper.getByTestId('fab'));

    expect(wrapper.getByTitle(packageMeta.latest.contributors[0].name)).toBeInTheDocument();
    expect(wrapper.getByTitle(packageMeta.latest.contributors[1].name)).toBeInTheDocument();
  });
});
