import React from 'react';

import { PackageManagers } from '@verdaccio/types';

import { useConfig } from '../../providers';
import { render, screen } from '../../test/test-react-testing-library';
import Install from './Install';
import { getGlobalInstall } from './InstallListItem';
import data from './__partials__/data.json';

const ComponentToBeRendered: React.FC<{ pkgManagers?: PackageManagers[] }> = () => {
  const { configOptions } = useConfig();
  return <Install configOptions={configOptions} packageMeta={data} packageName="foo" />;
};

/* eslint-disable react/jsx-no-bind*/
describe('<Install />', () => {
  test('renders correctly', () => {
    render(<ComponentToBeRendered />);
    expect(screen.getByText('yarn add foo@8.0.0')).toBeInTheDocument();
    expect(screen.getByText('pnpm install foo@8.0.0')).toBeInTheDocument();
    expect(screen.getByText('npm install foo@8.0.0')).toBeInTheDocument();
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

    render(<ComponentToBeRendered />);

    expect(screen.getByText('sidebar.installation.title')).toBeTruthy();
    expect(screen.queryByText('pnpm')).not.toBeInTheDocument();
    expect(screen.queryByText('yarn')).not.toBeInTheDocument();
    expect(screen.getByText('npm install foo@8.0.0')).toBeInTheDocument();
  });

  test('should have the element YARN', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers = ['yarn'];
    render(<ComponentToBeRendered />);
    expect(screen.getByText('sidebar.installation.title')).toBeTruthy();
    expect(screen.queryByText('pnpm')).not.toBeInTheDocument();
    expect(screen.queryByText('npm')).not.toBeInTheDocument();
    expect(screen.getByText('yarn add foo@8.0.0')).toBeInTheDocument();
  });

  test('should have the element PNPM', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers = ['pnpm'];
    render(<ComponentToBeRendered />);
    expect(screen.queryByText('pnpm')).not.toBeInTheDocument();
    expect(screen.queryByText('yarn')).not.toBeInTheDocument();
    expect(screen.getByText('pnpm install foo@8.0.0')).toBeInTheDocument();
  });
});

describe('getGlobalInstall', () => {
  test('no latest', () => {
    expect(getGlobalInstall(false, false, '1.0.0', 'foo')).toEqual('foo@1.0.0');
  });
  test('latest', () => {
    expect(getGlobalInstall(true, false, '1.0.0', 'foo')).toEqual('foo');
  });

  test('no global', () => {
    expect(getGlobalInstall(false, false, '1.0.0', 'foo')).toEqual('foo@1.0.0');
  });
  test('global', () => {
    expect(getGlobalInstall(false, true, '1.0.0', 'foo')).toEqual('-g foo@1.0.0');
  });

  test('yarn no global', () => {
    expect(getGlobalInstall(false, false, '1.0.0', 'foo', true)).toEqual('foo@1.0.0');
  });
  test('yarn global', () => {
    expect(getGlobalInstall(false, true, '1.0.0', 'foo', true)).toEqual('foo@1.0.0');
  });
});
