import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { store } from '../../store';
import { cleanup, renderWithStore } from '../../test/test-react-testing-library';
import PackageList from './PackageList';

describe('<PackageList /> component', () => {
  beforeEach(cleanup);

  test('should load the component with no packages', () => {
    const props = {
      packages: [],
    };
    const wrapper = renderWithStore(<PackageList packages={props.packages} />, store);
    expect(wrapper.getByText('help.title')).toBeInTheDocument();
  });

  test('should load the component with packages', () => {
    // Mock <Autosizer /> width
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

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

    const wrapper = renderWithStore(
      <BrowserRouter>
        <PackageList packages={props.packages} />
      </BrowserRouter>,
      store
    );

    expect(wrapper.queryAllByTestId('package-item-list')).toHaveLength(3);
  });
});
