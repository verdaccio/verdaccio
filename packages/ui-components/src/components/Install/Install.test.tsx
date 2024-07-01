import React from 'react';

import { PackageManagers } from '@verdaccio/types';

import { useConfig } from '../../providers';
import { render, screen } from '../../test/test-react-testing-library';
import Install from './Install';
import InstallListItem, { DependencyManager, getGlobalInstall } from './InstallListItem';
import data from './__partials__/data.json';

const ComponentToBeRendered: React.FC<{ name?: string; pkgManagers?: PackageManagers[] }> = ({
  name = 'foo',
}) => {
  const { configOptions } = useConfig();
  return <Install configOptions={configOptions} packageMeta={data} packageName={name} />;
};

/* eslint-disable react/jsx-no-bind*/
describe('<Install />', () => {
  test('renders correctly', () => {
    render(<ComponentToBeRendered />);
    expect(screen.getByText('yarn add foo@8.0.0')).toBeInTheDocument();
    expect(screen.getByText('pnpm install foo@8.0.0')).toBeInTheDocument();
    expect(screen.getByText('npm install foo@8.0.0')).toBeInTheDocument();
  });

  test('should not render if name is missing', () => {
    render(<ComponentToBeRendered name="" />);
    expect(screen.queryByTestId('installList')).toBeNull();
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

describe('<InstallListItem />', () => {
  test('renders correctly', () => {
    render(
      <InstallListItem
        dependencyManager={DependencyManager.NPM}
        packageName={'foo'}
        packageVersion={'8.0.0'}
      />
    );
    expect(screen.queryByTestId('installListItem-npm')).toBeInTheDocument();
  });

  test('should not render if name is missing', () => {
    render(
      // @ts-ignore - testing invalid value
      <InstallListItem dependencyManager={'other'} packageName={'foo'} packageVersion={'8.0.0'} />
    );
    // expect nothing to be rendered
    expect(screen.queryByTestId('installListItem-npm')).toBeNull();
  });
});

describe('getGlobalInstall', () => {
  test('version', () => {
    expect(getGlobalInstall(false, false, '1.0.0', 'foo')).toEqual('foo@1.0.0');
  });
  test('latest', () => {
    expect(getGlobalInstall(true, false, '1.0.0', 'foo')).toEqual('foo');
  });

  test('version global', () => {
    expect(getGlobalInstall(false, true, '1.0.0', 'foo')).toEqual('-g foo@1.0.0');
  });
  test('latest global', () => {
    expect(getGlobalInstall(true, true, '1.0.0', 'foo')).toEqual('-g foo');
  });

  test('yarn version', () => {
    expect(getGlobalInstall(false, false, '1.0.0', 'foo', true)).toEqual('foo@1.0.0');
  });
  test('yarn latest', () => {
    expect(getGlobalInstall(true, false, '1.0.0', 'foo', true)).toEqual('foo');
  });

  test('yarn version global', () => {
    expect(getGlobalInstall(false, true, '1.0.0', 'foo', true)).toEqual('foo@1.0.0');
  });
  test('yarn latest global', () => {
    expect(getGlobalInstall(true, true, '1.0.0', 'foo', true)).toEqual('foo');
  });
});
