import React from 'react';

import { PackageManagers } from '@verdaccio/types';

import { useConfig } from '../../providers';
import { render, screen } from '../../test/test-react-testing-library';
import Install from './Install';
import data from './__partials__/data.json';

const ComponentToBeRendered: React.FC<{ pkgManagers?: PackageManagers[] }> = () => {
  const { configOptions } = useConfig();
  return <Install configOptions={configOptions} packageMeta={data} packageName="foo" />;
};

/* eslint-disable react/jsx-no-bind*/
describe('<Install />', () => {
  test('renders correctly', () => {
    render(<ComponentToBeRendered />);
    expect(screen.getByText('sidebar.installation.install-using-pnpm')).toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-yarn')).toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-npm')).toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-npm-command')).toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-yarn-command')).toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-pnpm-command')).toBeInTheDocument();
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
    expect(screen.queryByText('sidebar.installation.install-using-pnpm')).not.toBeInTheDocument();
    expect(screen.queryByText('sidebar.installation.install-using-yarn')).not.toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-npm')).toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-npm-command')).toBeInTheDocument();
    expect(
      screen.queryByText('sidebar.installation.install-using-yarn-command')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('sidebar.installation.install-using-pnpm-command')
    ).not.toBeInTheDocument();
  });

  test('should have the element YARN', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers = ['yarn'];
    render(<ComponentToBeRendered />);
    expect(screen.getByText('sidebar.installation.title')).toBeTruthy();
    expect(screen.queryByText('sidebar.installation.install-using-pnpm')).not.toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-yarn')).toBeInTheDocument();
    expect(screen.queryByText('sidebar.installation.install-using-npm')).not.toBeInTheDocument();
    expect(
      screen.queryByText('sidebar.installation.install-using-npm-command')
    ).not.toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-yarn-command')).toBeInTheDocument();
    expect(
      screen.queryByText('sidebar.installation.install-using-pnpm-command')
    ).not.toBeInTheDocument();
  });

  test('should have the element PNPM', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers = ['pnpm'];
    render(<ComponentToBeRendered />);
    expect(screen.getByText('sidebar.installation.title')).toBeTruthy();
    expect(screen.getByText('sidebar.installation.install-using-pnpm')).toBeInTheDocument();
    expect(screen.queryByText('sidebar.installation.install-using-yarn')).not.toBeInTheDocument();
    expect(screen.queryByText('sidebar.installation.install-using-npm')).not.toBeInTheDocument();
    expect(
      screen.queryByText('sidebar.installation.install-using-npm-command')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('sidebar.installation.install-using-yarn-command')
    ).not.toBeInTheDocument();
    expect(screen.getByText('sidebar.installation.install-using-pnpm-command')).toBeInTheDocument();
  });
});
