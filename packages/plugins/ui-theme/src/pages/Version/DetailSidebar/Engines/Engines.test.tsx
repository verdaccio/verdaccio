import React from 'react';

import { render, cleanup } from 'verdaccio-ui/utils/test-react-testing-library';

import { PackageMetaInterface } from '../../../../../types/packageMeta';
import { DetailContext } from '../../context';

import Engine from './Engines';

jest.mock('./img/node.png', () => '');
jest.mock('../Install/img/npm.svg', () => '');

const mockPackageMeta = (
  engines?: PackageMetaInterface['latest']['engines']
): PackageMetaInterface => ({
  latest: {
    name: 'verdaccio',
    version: '0.0.0',
    dist: {
      fileCount: 1,
      unpackedSize: 1,
    },
    ...(engines && { engines }),
  },
  _uplinks: {},
});

describe('<Engines /> component', () => {
  afterEach(() => {
    cleanup();
  });
  const htmlRender = 'NPM Version';

  test('should render the component in default state', () => {
    const packageMeta = mockPackageMeta({
      node: '>= 0.1.98',
      npm: '>3',
    });

    const wrapper = render(
      <DetailContext.Provider value={{ packageMeta }}>
        <Engine />
      </DetailContext.Provider>
    );

    expect(wrapper.getByText(htmlRender)).toBeInTheDocument();
  });

  test('should render the component when there is no engine key in package meta', () => {
    const packageMeta = mockPackageMeta();
    const wrapper = render(
      <DetailContext.Provider value={{ packageMeta }}>
        <Engine />
      </DetailContext.Provider>
    );

    expect(wrapper.queryByText(htmlRender)).not.toBeInTheDocument();
  });

  test('should render the component when there is no keys in engine in package meta', () => {
    const packageMeta = mockPackageMeta({});

    const wrapper = render(
      <DetailContext.Provider value={{ packageMeta }}>
        <Engine />
      </DetailContext.Provider>
    );

    expect(wrapper.queryByText(htmlRender)).not.toBeInTheDocument();
  });
});
