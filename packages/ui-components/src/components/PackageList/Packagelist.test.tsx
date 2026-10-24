import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  RouterPath,
  cleanup,
  renderWith,
  renderWithRouter,
} from '../../test/test-react-testing-library';
import PackageList from './PackageList';

describe('<PackageList /> component', () => {
  beforeEach(cleanup);

  test('should load the component with no packages', () => {
    const props = {
      packages: [],
    };
    const wrapper = renderWith(<PackageList packages={props.packages} />);
    expect(wrapper.getByText('help.title')).toBeInTheDocument();
  });

  test('should load the component with packages', () => {
    // Mock <Autosizer /> width
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

    const props = {
      packages: [
        {
          name: 'verdaccio',
          version: '1.0.0',
          time: new Date(1532211072138).getTime(),
          description: 'Private NPM repository',
          author: { name: 'Sam', avatar: 'test avatar' },
        },
        {
          name: 'abc',
          version: '1.0.1',
          time: new Date(1532211072138).getTime(),
          description: 'abc description',
          author: { name: 'Rose', avatar: 'test avatar' },
        },
        {
          name: 'xyz',
          version: '1.1.0',
          description: 'xyz description',
          keywords: ['hello', 'mars'],
          author: { name: 'Martin', avatar: 'test avatar' },
        },
      ],
      help: false,
    };

    const wrapper = renderWithRouter(
      <PackageList packages={props.packages as any} />,
      RouterPath.ROOT,
      [RouterPath.ROOT]
    );

    expect(wrapper.queryAllByTestId('package-item-list')).toHaveLength(3);
  });

  test.each([
    [true, 1],
    [false, 0],
  ])('shows the download button when showDownloadTarball is %s', (showDownloadTarball, count) => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);
    window.__VERDACCIO_BASENAME_UI_OPTIONS = { showDownloadTarball };
    const packages = [
      {
        name: 'verdaccio',
        version: '6.1.2',
        description: 'A lightweight private npm proxy registry',
        author: { name: 'Verdaccio contributors' },
        dist: { tarball: 'http://localhost:4873/verdaccio/-/verdaccio-6.1.2.tgz' },
      },
    ];
    const wrapper = renderWithRouter(<PackageList packages={packages as any} />, RouterPath.ROOT, [
      RouterPath.ROOT,
    ]);
    expect(wrapper.queryAllByTestId('download-tarball')).toHaveLength(count);
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {};
  });
});
