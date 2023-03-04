/* eslint-disable verdaccio/jsx-spread */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { cleanup, render } from '../../test/test-react-testing-library';
import Versions, { Props } from './Versions';
import data from './__partials__/data.json';

const ComponentToBeRendered: React.FC<Props> = (props) => (
  <MemoryRouter>
    <Versions {...props} />
  </MemoryRouter>
);

describe('<Version /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render versions', () => {
    const { getByText } = render(<ComponentToBeRendered packageMeta={data} packageName={'foo'} />);

    expect(getByText('versions.version-history')).toBeTruthy();
    expect(getByText('versions.current-tags')).toBeTruthy();

    // pick some versions
    expect(getByText('2.3.0')).toBeTruthy();
    expect(getByText('canary')).toBeTruthy();
  });

  test('should not render versions', () => {
    const { queryByText } = render(<ComponentToBeRendered packageMeta={{}} packageName={'foo'} />);

    expect(queryByText('versions.version-history')).toBeFalsy();
    expect(queryByText('versions.current-tags')).toBeFalsy();
  });

  test.todo('should click on version link');
});
