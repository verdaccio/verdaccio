import React from 'react';

import { render, screen } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContext } from '../../context';
import { DetailContextProps } from '../../version-config';

import data from './__partials__/data.json';
import Install from './Install';

const detailContextValue: Partial<DetailContextProps> = {
  packageName: 'foo',
  packageMeta: data,
};

const ComponentToBeRendered: React.FC = () => (
  <DetailContext.Provider value={detailContextValue}>
    <Install />
  </DetailContext.Provider>
);

/* eslint-disable react/jsx-no-bind*/
describe('<Install />', () => {
  test('renders correctly', () => {
    render(<ComponentToBeRendered />);
    expect(screen.getByText('pnpm install foo')).toBeInTheDocument();
    expect(screen.getByText('yarn add foo')).toBeInTheDocument();
    expect(screen.getByText('npm install foo')).toBeInTheDocument();
  });

  test('should have 3 children', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers = ['yarn', 'pnpm', 'npm'];
    const { getByTestId } = render(<ComponentToBeRendered />);
    const installListItems = getByTestId('installList');
    // installitems + subHeader = 4
    expect(installListItems.children.length).toBe(4);
  });

  test('should have the element NPM', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers = ['npm'];
    const { getByTestId, queryByText } = render(<ComponentToBeRendered />);
    expect(getByTestId('installListItem-npm')).toBeTruthy();
    expect(queryByText(`npm install ${detailContextValue.packageName}`)).toBeTruthy();
    expect(queryByText('Install using npm')).toBeTruthy();
    expect(screen.queryByText('pnpm install foo')).not.toBeInTheDocument();
    expect(screen.queryByText('yarn add foo')).not.toBeInTheDocument();
  });

  test('should have the element YARN', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers = ['yarn'];
    const { getByTestId, queryByText } = render(<ComponentToBeRendered />);
    expect(getByTestId('installListItem-yarn')).toBeTruthy();
    expect(queryByText(`yarn add ${detailContextValue.packageName}`)).toBeTruthy();
    expect(queryByText('Install using yarn')).toBeTruthy();
  });

  test('should have the element PNPM', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers = ['pnpm'];
    const { getByTestId, queryByText } = render(<ComponentToBeRendered />);
    expect(getByTestId('installListItem-pnpm')).toBeTruthy();
    expect(queryByText(`pnpm install ${detailContextValue.packageName}`)).toBeTruthy();
    expect(queryByText('Install using pnpm')).toBeTruthy();
  });
});
