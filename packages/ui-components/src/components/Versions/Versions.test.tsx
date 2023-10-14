/* eslint-disable verdaccio/jsx-spread */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { cleanup, render, screen } from '../../test/test-react-testing-library';
import Versions, { Props } from './Versions';
import data from './__partials__/data.json';
import dataDeprecated from './__partials__/deprecated-versions.json';

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

  test('should render versions deprecated settings', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.hideDeprecatedVersions = true;
    const { getByText } = render(
      <ComponentToBeRendered packageMeta={dataDeprecated} packageName={'foo'} />
    );
    expect(getByText('versions.hide-deprecated')).toBeTruthy();

    // pick some versions
    expect(screen.queryByText('0.0.2')).not.toBeInTheDocument();
    expect(screen.getByText('0.0.1')).toBeInTheDocument();
  });

  test.todo('should click on version link');
});
